var topFolders = ['默认分类', '百度ife项目', '毕业设计'];
var classList = document.getElementById('taskByClassMain');
var taskList = document.getElementById('tasksListContent');
var m = new Map();
var taskMap = new Map();
taskMap.set('task001', [{'name':'to-do 1', 'date':'20150528', 'done':'done'}, {'name':'to-do 2', 'date':'20150428', 'done':'undo'}, {'name':'to-do 3', 'date':'20150428', 'done':'undo'}]);
m.set('默认分类', [{'name':'小论文', 'type':'1'}])
m.set('百度ife项目', [{'name':'day1', 'type':'1'}, {'name':'task001', 'type':'0'}, {'name':'task002', 'type':'0'}]);
m.set('day1', [{'name':'task003', 'type':'0'}, {'name':'task004', 'type':'0'}]);
function createClassList(className, layer=0) { 
    //className是目录名称，根据目录名称创建目录
    var ele = document.createElement('div');
    var itemCount = 0;
    ele.setAttribute('class', 'folder closed');
    var marginLeft, paddingLeft;
    if(layer == 0) {
        marginLeft = '15px';
        paddingLeft = '15px';
    } else {
        marginLeft = (layer*10+5) + 'px';
        paddingLeft = (layer*10+15) + 'px';
    }
    ele.setAttribute('style','margin-left:-' + marginLeft + '; padding-left:' + paddingLeft + ';');
    var itemList = m.get(className);
    if(itemList) {
        itemCount = itemList.length;
    }
    //itemList为目录下文件的集合
    ele.innerHTML = `<div class='folderInfo' style='margin-left:-${paddingLeft}; padding-left:${paddingLeft};'><span class="folderImg closed"></span><span class="folderName">${className} (${itemCount})</span></div>
                    <div class="folderContent"></div>`;
    if(itemCount == 0) {
        return ele;
    }
    var contentList = ele.getElementsByClassName('folderContent')[0];
    for(let item of itemList) {
        let childEle = document.createElement('div');
        if(item.type == 1) {
            childEle = createClassList(item.name, layer+1);      
        } else {
            childEle.setAttribute('class', 'task');
            if(layer == 0) {
                childEle.setAttribute('style','margin-left:-15px; ' + 'padding-left:30px;');
            } else {
                childEle.setAttribute('style','margin-left:-' + (layer*10+15)+ 'px; ' + 'padding-left:' + (layer*10+30) +'px;');
            }
            childEle.innerHTML = item.name;
        }
        contentList.appendChild(childEle);
    }
    return ele;
}

function showTasks(taskName) {
    taskList.innerHTML = '';
    console.log(typeof taskName.innerHTML);
    if(taskMap.get(taskName.innerHTML)) {
        for(let task of taskMap.get(taskName.innerHTML)) {
            showTask(task);
        }  
    } 
}

function showTask(task) {
    var singleTask = document.createElement('div');
    singleTask.setAttribute('class', 'singleTask ' + task.done);
    singleTask.innerHTML = task.name;
    var tasksByDate = taskList.querySelector('div[date="' + task.date +'"]');
    if(tasksByDate) {
        tasksByDate.appendChild(singleTask);
    } else {
        tasksByDate = document.createElement('div');
        tasksByDate.setAttribute('class', 'tasksByDate');
        tasksByDate.setAttribute('date',task.date);
        tasksByDate.innerHTML = `<div class='date'>${task.date.substring(0,4)}-${task.date.substring(4,6)}-${task.date.substring(6,8)}`;
        tasksByDate.appendChild(singleTask);
        taskList.appendChild(tasksByDate);
    }
}

function showAllTask(event) {
    var singleTasks = document.querySelectorAll('.singleTask');
    console.log(singleTasks);
    for (let singleTask of singleTasks) {
        singleTask.style.display = '';
    }
}

function showUndoTask(event) {
    var singleTasks = document.querySelectorAll('.singleTask');
    for (let singleTask of singleTasks) {
        if(!singleTask.classList.contains('undo')) {
            singleTask.style.display = 'none';
        } else {
            singleTask.style.display = '';
        }
    }
}

function showDoneTask(event) {
    var singleTasks = document.querySelectorAll('.singleTask');
    console.log(singleTasks);
    for (let singleTask of singleTasks) {
        if(singleTask.classList.contains('done')) {
            singleTask.style.display = '';
        } else {
            singleTask.style.display = 'none';
        }
    }
}

function folderClick(event) {
    var target = event.target;
    var parent, imgChild;
    if(target.classList.contains('folderInfo')) {
        parent = target.parentNode;
        imgChild = target.firstChild;
        imgChild.classList.toggle('open');
        imgChild.classList.toggle('closed');
        parent.classList.toggle('open');
        parent.classList.toggle('closed');
    } else if(target.classList.contains('folderImg') || target.classList.contains('folderName')) {
        parent = target.parentNode.parentNode;
        imgChild = parent.getElementsByClassName('folderImg')[0];
        imgChild.classList.toggle('open');
        imgChild.classList.toggle('closed');
        parent.classList.toggle('open');
        parent.classList.toggle('closed');
    } else if(target.classList.contains('task')) {
        showTasks(target);
    }
}

function showTaskContent(event) {
    document.getElementById('taskName').innerHTML = event.target.innerHTML;
    document.getElementById('taskDate').innerHTML = (' ' + event.target.parentNode.getAttribute('date'));
}

function init() {
    for(let topFolder of topFolders) {
        classList.appendChild(createClassList(topFolder, 0));
    };
    document.getElementById('taskByClass').addEventListener('click', function(event){
            folderClick(event);
        }, false);
    document.getElementById('tasksNav').addEventListener('click', function(event) {
        console.log(event.target.id);
        var navList = document.querySelectorAll('#tasksNav>span');
        if(event.target.id.toLowerCase() == 'showall') {
            console.log(document);
            var navList = document.querySelectorAll('#tasksNav>span');
            for(let showButton of navList) {
                showButton.classList.remove('show');
            }
            event.target.classList.add('show');
            showAllTask(event);
        } else if(event.target.id.toLowerCase() == 'showundo') {
            for(let showButton of navList) {
                showButton.classList.remove('show');
            }
            event.target.classList.add('show');
            showUndoTask(event);
        } else if(event.target.id.toLowerCase() == 'showdone') {
            for(let showButton of navList) {
                showButton.classList.remove('show');
            }
            event.target.classList.add('show');
            showDoneTask(event);
        }
    });
    document.getElementById('tasksListContent').addEventListener('click', function(event) {
        if(event.target.classList.contains('singleTask')) {
            showTaskContent(event);
        }
    }, false);
}

window.onload = function() {
    init();
}