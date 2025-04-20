document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.querySelector(".container button");
    const addSectionBtn = document.querySelector(".btn2");

    const popupForm = document.getElementById("popupForm");
    const popupSectionForm = document.getElementById("popupSectionForm");

    const closeFormBtn = document.getElementById("closeForm");
    const closeSectionFormBtn = document.getElementById("closeSectionForm");

    const saveTaskBtn = document.getElementById("saveTask");
    const saveSectionBtn = document.getElementById("saveSection");

    const taskNameInput = document.getElementById("taskName");
    const sectionNameInput = document.getElementById("sectionName");
    const sectionDateInput = document.getElementById("sectionDate");
    const sectionTag = document.getElementById("sectionTag");
    const sectionDescInput = document.getElementById("sectionDesc");

    const container = document.querySelector(".container");
    const plusBtn = document.querySelector(".hero2");

    plusBtn.addEventListener("click", () => {
        popupSectionForm.style.display = 'flex';
    });

    let currentEditElement = null;
    let isEditingTask = false;

    const colors = ["#ff7675", "#3498db", "#55efc4", "#ffeaa7"];
    let colorIndex = 0;
    let colorCount = 0;

    function getNextColor() {
        const color = colors[colorIndex];
        colorCount++;
        if (colorCount >= 2) {
            colorIndex = (colorIndex + 1) % colors.length;
            colorCount = 0;
        }
        return color;
    }

    function formatDate(inputDate) {
        if (!inputDate) return "No Date";
        const dateObj = new Date(inputDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = dateObj.toLocaleDateString('en-US', options);
        return formatted.replace(",", "");
    }

    let allData = JSON.parse(localStorage.getItem("todoData")) || [];

    function saveToLocalStorage() {
        localStorage.setItem("todoData", JSON.stringify(allData));
    }

    function render() {
        container.querySelectorAll(".box, .section-wrapper").forEach(el => el.remove());

        allData.forEach(task => {
            const box = document.createElement("div");
            box.className = 'box';
            box.dataset.id = task.id;

            box.innerHTML = `
                <div class="left-side collapsible-content">
                    <div class="triangle"></div>
                    <h4 class="object">${task.name}</h4>
                </div>
                <div class="right-side">
                    <img src="image/editicon.png" alt="edit" class="edit-task">
                    <img src="image/wasteicon.png" class="delete-task" style="height: 15px;width: 14px;">
                </div>
            `;

            const sectionWrapper = document.createElement("div");
            sectionWrapper.className = 'section-wrapper';

            task.sections.forEach(section => {
                const sectionBox = document.createElement("div");
                sectionBox.className = 'box1';
                sectionBox.dataset.id = section.id;

                const tagColor = getNextColor();
                const sectionDateFormatted = formatDate(section.date);
                const dateSpan = document.createElement("span");
                dateSpan.className = "section-date";
                dateSpan.setAttribute("data-raw", section.date);
                dateSpan.textContent = sectionDateFormatted || 'No Date';

                sectionBox.innerHTML = `
                    <div class="left-side">
                        <div><img src="image/mark.png" alt="check"></div>
                        <p>${section.name}</p>
                    </div>
                    <div class="right-side">
                        <span><button class="tag-btn" style="background-color: ${tagColor}; color: white;">${section.tag || 'No Tag'}</button></span>
                    </div>
                `;

                const rightSide = sectionBox.querySelector(".right-side");
                rightSide.appendChild(dateSpan);

                const iconDiv = document.createElement("div");
                iconDiv.className = "set";
                iconDiv.innerHTML = `
                    <img src="image/editicon.png" alt="edit" class="edit-section" style="margin-left: 11px;">
                    <img src="image/deleteicon2.png" class="delete-section" style="height: 15px;width:14px;">
                `;
                rightSide.appendChild(iconDiv);

                sectionBox.dataset.description = section.desc;
                sectionWrapper.appendChild(sectionBox);
                sectionWrapper.appendChild(document.createElement("hr"));
            });

            container.appendChild(box);
            container.appendChild(sectionWrapper);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        popupForm.style.display = 'flex';
    });
    popupForm.style.display = 'none';
    popupSectionForm.style.display = 'none'; 
     
    addSectionBtn.addEventListener('click', () => {
        popupSectionForm.style.display = 'flex';
    });

    closeFormBtn.addEventListener('click', () => {
        popupForm.style.display = 'none';
    });

    closeSectionFormBtn.addEventListener('click', () => {
        popupSectionForm.style.display = 'none';
    });

    saveTaskBtn.addEventListener('click', () => {
        const taskName = taskNameInput.value.trim();
        if (taskName === '') {
            alert('Task name is required!');
            return;
        }

        const taskId = Date.now().toString();
        allData.push({
            id: taskId,
            name: taskName,
            sections: []
        });

        saveToLocalStorage();
        render();
        popupForm.style.display = 'none';
        taskNameInput.value = '';
    });

    saveSectionBtn.addEventListener('click', () => {
        const sectionName = sectionNameInput.value.trim();
        const sectionDate = sectionDateInput.value;
        const tagValue = sectionTag.value.trim();
        const sectionDesc = sectionDescInput.value.trim();

        if (sectionName === '') {
            alert('Section name is required!');
            return;
        }

        const sectionId = Date.now().toString();
        const sectionData = {
            id: sectionId,
            name: sectionName,
            date: sectionDate,
            tag: tagValue,
            desc: sectionDesc
        };

        if (allData.length > 0) {
            allData[allData.length - 1].sections.push(sectionData);
            saveToLocalStorage();
            render();
        }

        sectionNameInput.value = '';
        sectionDateInput.value = '';
        sectionTag.value = '';
        sectionDescInput.value = '';
        popupSectionForm.style.display = 'none';
    });

    container.addEventListener('click', function (e) {
        const target = e.target;

        if (target.classList.contains('triangle')) {
            target.classList.toggle('rotated');
            const taskBox = target.closest('.box');
            const sectionWrapper = taskBox.nextElementSibling;
            if (sectionWrapper && sectionWrapper.classList.contains('section-wrapper')) {
                const children = sectionWrapper.children;
                for (let child of children) {
                    child.classList.toggle('collapsed');
                }
            }
        }

        if (target.classList.contains("delete-task")) {
            const box = target.closest(".box");
            const taskId = box.dataset.id;
            allData = allData.filter(t => t.id !== taskId);
            saveToLocalStorage();
            render();
        }

        if (target.classList.contains("delete-section")) {
            const sectionBox = target.closest(".box1");
            const sectionId = sectionBox.dataset.id;
            const taskBox = sectionBox.closest(".section-wrapper").previousElementSibling;
            const taskId = taskBox.dataset.id;

            const task = allData.find(t => t.id === taskId);
            if (task) {
                task.sections = task.sections.filter(s => s.id !== sectionId);
                saveToLocalStorage();
                render();
            }
        }

        if (target.classList.contains("edit-task")) {
            const box = target.closest(".box");
            currentEditElement = box;
            isEditingTask = true;
            const taskName = box.querySelector("h4.object").textContent;
            taskNameInput.value = taskName;
            popupForm.style.display = 'flex';
        }

        if (target.classList.contains("edit-section")) {
            const sectionBox = target.closest(".box1");
            currentEditElement = sectionBox;
            isEditingTask = false;

            const p = sectionBox.querySelector(".left-side p").textContent;
            const btn = sectionBox.querySelector(".tag-btn")?.textContent || '';
            const dtElem = sectionBox.querySelector(".section-date");
            const dt = dtElem?.dataset.raw || '';
            const desc = sectionBox.dataset.description || '';

            sectionNameInput.value = p;
            sectionTag.value = btn;
            sectionDateInput.value = dt;
            sectionDescInput.value = desc;
            popupSectionForm.style.display = 'flex';
        }
    });

    render();
});
