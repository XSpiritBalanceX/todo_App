//меняем закладку в URL, т.к. приложение SPA
//получаем id блоков,которые потом будем выводить по нажатию кнопки
var activ=document.getElementById('aktivList');
var endTask=document.getElementById('endList');
var deletTask=document.getElementById('deletList');
var rulHTTP;
window.onhashchange=switchToStateFromURLHash;
var SPAState={};
function switchToStateFromURLHash() {
    var URLHash=window.location.hash;
    var stateStr=URLHash.substr(1);
    if ( stateStr!="" ) { // если закладка непустая, читаем из неё состояние и отображаем
      var parts=stateStr.split("_")
      SPAState={ pagename: parts[0] }; // первая часть закладки - номер страницы
    }
    else
    SPAState={pagename:'Main'};

    switch ( SPAState.pagename ) {
      case 'Main':
          activ.style.display='none';
          endTask.style.display='none';
          deletTask.style.display='none';
          break;
      case 'Activ':
        activ.style.display='block';
        endTask.style.display='none';
        deletTask.style.display='none';
        break; 
     case 'Complited':
        activ.style.display='none';
        endTask.style.display='block';
        deletTask.style.display='none';
        break; 
     case 'Deleted':
        activ.style.display='none';
        endTask.style.display='none';
        deletTask.style.display='block';
        break; 
    }
}
// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function switchToState(newState) {
    var stateStr=newState.pagename;        
    location.hash=stateStr;
}
function switchToMain() {
    switchToState( { pagename:'Main' } );
  }  
function switchToMain() {
    switchToState( { pagename:'Main' } );
}  
function switchToActiv(){
    switchToState( { pagename:'Activ' } );
}
function switchToComplit(){
    switchToState( { pagename:'Complited' } );
}
function switchToDelet(){
    switchToState( { pagename:'Deleted' } );
}
switchToStateFromURLHash();

//создаем класс хранилище данных о задачах
class StorageTask{
    constructor(name){
        this.name=name;
		if (localStorage.getItem(this.name)!=null){
          this.stor=JSON.parse(localStorage.getItem(this.name)) ;
		}
		else{
			this.stor={};
		}
    }
  addValue(key, value){
    this.stor[key]=value;
    localStorage.setItem(this.name, JSON.stringify(this.stor));
  }
  getValue(){
    return localStorage.getItem(this.name) ;
  }
  deleteValue(key){    
    if (!(key in this.stor)){
      return false;
     }
     else{
       delete this.stor[key];
       localStorage.setItem(this.name, JSON.stringify(this.stor));
      return delete this.stor[key];
     }
  }
  getKeys(){
    return Object.keys(this.stor);
   }
}

var taskStorage=new StorageTask('активные');
var delStorage=new StorageTask('удаленные');
var complitedStorage=new StorageTask('завершенные');
var activite;
var ulActivTask= document.getElementById('ulActivTask');
//функция для сохранения задачи и вывода в список
document.getElementById('saveTask').onclick=function () {
  activite='active';
  let newTask=document.getElementById('newTask').value;  
  taskStorage.addValue(newTask.trim(), {isActive: activite});
  var liTask=document.createElement('li');  
  liTask.innerHTML=`<i class="fa fa-circle-o" aria-hidden="true"></i>`+'  '+newTask;
  ulActivTask.appendChild(liTask);
}
//если localStorage не пустой, то выводим задачи в список
if (localStorage.getItem('активные')!=null){
  let liTaskStorage=document.createElement('li');
  liTaskStorage.innerHTML=taskStorage.getValue();
  var jsMetod=taskStorage.getValue();
  var objTask=JSON.parse(jsMetod);
  for (key in objTask){
    var lTS=document.createElement('li');
    lTS.innerHTML=`<i class="fa fa-circle-o" aria-hidden="true"></i>`+'  '+key;
    ulActivTask.appendChild(lTS);
  }
}

//получаем содержимое li по клику на него
ulActivTask.onclick=function(EO) {
  EO=EO||window.event;
  document.getElementById('btnActiv').style.visibility='visible';
  let compl=EO.srcElement.textContent;
  let elTarget=EO.srcElement;
  elTarget.classList.add("active");
  //функция для выполненой задачи
  document.getElementById('complTas').onclick=function(){
    var complitT=document.createElement('li');
    complitT.innerHTML=`<i class="fa fa-check-square-o" aria-hidden="true"></i>`+'  '+compl;    
    document.getElementById('ulComplTask').appendChild(complitT);
    taskStorage.deleteValue(compl.trim());
    activite='complited';
    complitedStorage.addValue(compl.trim(), {isActive:activite});
    elTarget.classList.remove("active");
    elTarget.innerHTML='';    
  }
  //функция для удаления задачи
  document.getElementById('delTask').onclick=function(){
    var dTask=document.createElement('li');
    dTask.innerHTML=`<i class="fa fa-ban" aria-hidden="true"></i>`+'  '+compl;
    document.getElementById('ulDelTask').appendChild(dTask);
    taskStorage.deleteValue(compl.trim());   
    activite='noActive';
    delStorage.addValue(compl.trim(), {isActive:activite});
    elTarget.classList.remove("active");
    elTarget.innerHTML='';
  }  
}
//удаление всех задач по кнопке
  document.getElementById('delAllActive').onclick=function(){
    let resAnswerActive=confirm('Вы уверены, что хотите удалить все? Все будет удалено безвозвратно')
    if (resAnswerActive==true){
      localStorage.removeItem('активные');
      document.getElementById('ulActivTask').innerHTML='';
      document.getElementById('btnActiv').style.visibility='hidden';
    }
   
  }

//выводим содержимое в список завершенных и удаленных
if (localStorage.getItem('завершенные')!=null){
  let liTaskCompl=document.createElement('li');
  liTaskCompl.innerHTML=complitedStorage.getValue();
  var jsMetodCompl=complitedStorage.getValue();
  var objTaskCompl=JSON.parse(jsMetodCompl);
  for (key in objTaskCompl){
    var lTSComp=document.createElement('li');
    lTSComp.innerHTML=`<i class="fa fa-check-square-o" aria-hidden="true"></i>`+'  '+key;
    document.getElementById('ulComplTask').appendChild(lTSComp);
  }
}
if (localStorage.getItem('удаленные')!=null){
  let liTaskDel=document.createElement('li');
  liTaskDel.innerHTML=delStorage.getValue();
  var jsMetoDel=delStorage.getValue();
  var objTaskDel=JSON.parse(jsMetoDel);
  for (key in objTaskDel){
    var lTSDel=document.createElement('li');
    lTSDel.innerHTML=`<i class="fa fa-ban" aria-hidden="true"></i>`+'  '+key;
    document.getElementById('ulDelTask').appendChild(lTSDel);
  }
}

//в завершенных задачах удаляем выбранное
document.getElementById('ulComplTask').onclick=function(EO){
  EO=EO||window.event;
  document.getElementById('btnComplited').style.visibility='visible';
  let delComplited=EO.target.textContent;
  let elTargetComplited=EO.srcElement;
  elTargetComplited.classList.add("active");
  //удаляем задачу по клику
  document.getElementById('delTaskCompl').onclick=function(){
    var delComplTask=document.createElement('li');
    delComplTask.innerHTML=`<i class="fa fa-ban" aria-hidden="true"></i>`+'  '+delComplited;    
    document.getElementById('ulDelTask').appendChild(delComplTask);
    complitedStorage.deleteValue(delComplited.trim());
    activite='noActive';
    delStorage.addValue(delComplited.trim(), {isActive:activite});
    complitedStorage.deleteValue(delComplited.trim());
    elTargetComplited.classList.remove("active");
    elTargetComplited.innerHTML='';      
  }  
}
//удаление всех задач по кнопке
  document.getElementById('delAllComplited').onclick=function(){
    let resAnswerComplited=confirm('Вы уверены, что хотите удалить все? Все будет удалено безвозвратно')
    if (resAnswerComplited==true){
      localStorage.removeItem('завершенные');
      document.getElementById('ulComplTask').innerHTML='';
      document.getElementById('btnComplited').style.visibility='hidden';
    }    
  }
var activBut;
//работаем с удаленными задачами
document.getElementById('ulDelTask').onclick=function(EO){
  EO=EO||window.event;
  document.getElementById('btnDeleted').style.visibility='visible';
  let deletedTask=EO.target.textContent;
  let elSRCDeleted=EO.srcElement;
  elSRCDeleted.classList.add("active");  
  //по кнопке восстанавливаем удаленную задачу в активные
  document.getElementById('delButt').onclick=function(){
   var restoredTask=document.createElement('li');
   restoredTask.innerHTML=`<i class="fa fa-circle-o" aria-hidden="true"></i>`+'  '+deletedTask;
   ulActivTask.appendChild(restoredTask);
   activite='active'; 
   taskStorage.addValue(deletedTask.trim(), {isActive: activite});
   delStorage.deleteValue(deletedTask.trim());
   elSRCDeleted.classList.remove("active");
   document.getElementById('ulDelTask').innerHTML='';
 }  
 
}

//удаляем все задачи по кнопке
 document.getElementById('delAll').onclick=function(){
  let resAnswerDel=confirm('Вы уверены, что хотите удалить все? Все будет удалено безвозвратно')
  if (resAnswerDel==true){
   localStorage.removeItem('удаленные');
   document.getElementById('ulDelTask').innerHTML='';
   document.getElementById('btnDeleted').style.visibility='hidden';
  }
 }
 
