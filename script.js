const targetForm = document.getElementById('target-form');
const targetTitle = document.getElementById('target-title');
const targetCategory = document.getElementById('target-category');
const targetDeadline = document.getElementById('target-deadline');
const targetList = document.getElementById('target-list');
const emptyState = document.getElementById('empty-state');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const statsText = document.getElementById('stats-text');
const badgeCount = document.getElementById('badge-count');

let targets = JSON.parse(localStorage.getItem('studyTargets')) || [];

function updateData() {
    localStorage.setItem('studyTargets', JSON.stringify(targets));
    renderTargets();
    calculateProgress();
}

function calculateProgress() {
    const total = targets.length;
    const completed = targets.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}%`;
    statsText.innerText = `${completed} dari ${total} target diselesaikan`;
    badgeCount.innerText = `${total} Total`;
}

function renderTargets() {
    targetList.innerHTML = '';
    
    if (targets.length === 0) {
        targetList.appendChild(emptyState);
        emptyState.style.display = 'block';
        return;
    } else {
        emptyState.style.display = 'none';
    }

    targets.forEach((target, index) => {
        const item = document.createElement('div');
        
        item.className = `target-item ${target.completed ? 'completed' : ''}`;

        item.innerHTML = `
            <div class="item-left">
                <button onclick="toggleComplete(${index})" class="btn-check" title="Tandai Selesai">
                    <i class="${target.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
                </button>
                <div class="item-info">
                    <p class="item-title">${target.title}</p>
                    <div class="item-meta">
                        <span class="item-tag">${target.category}</span>
                        <span class="item-date">
                            <i class="fa-regular fa-calendar"></i> ${formatDate(target.deadline)}
                        </span>
                    </div>
                </div>
            </div>
            <button onclick="deleteTarget(${index})" class="btn-delete" title="Hapus Target">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;
        targetList.appendChild(item);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}
targetForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const newTarget = {
        title: targetTitle.value,
        category: targetCategory.value,
        deadline: targetDeadline.value,
        completed: false
    };

    targets.push(newTarget);
    updateData();

    targetForm.reset();
});

window.toggleComplete = function(index) {
    targets[index].completed = !targets[index].completed;
    updateData();
};

window.deleteTarget = function(index) {
    if(confirm('Apakah kamu ingin menghapus daftar tugas ini?')) {
        targets.splice(index, 1);
        updateData();
    }
};

updateData();