
import { io } from './genira/scripts->socket.io.esm.min.js';

function _GET(parameterName) {
  var result = null;
  var tmp = [];
  location.search
    .substr(1)
    .split('&')
    .forEach(item => {
      tmp = item.split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;  
}
const socket = io.connect('', {
  path: '/admin-socket/',
  autoConnect: false,
});
socket.connect();
socket.on('connectionError', (err) => {
  console.log(err);
});

function setTab(tabname) {
  if(window.tabname && window.tabname == tabname) {
    console.log('window.tabname:', window.tabname)
    return;
  }
  socket.emit('load-tab', tabname);
  socket.on('tab-loader', (requestId, tabData) => {
    window.tabname = tabData.tabname;
    $('#tab-content').html(tabData.content);
    $('.sidebar').children().toArray().forEach(child => {
      child.className = child.id.replaceAll('sidebar-menu-', '') == window.tabname ? 'sidebar-menu active' : 'sidebar-menu';
    });
  });
  if(tabname == 'users') socket.emit('load-users');
}

$(document).ready(() => {
  var tabname = _GET('tab');
  if(tabname == null) tabname = 'dashboard';
  setTab(tabname)
  socket.on('users-update', (requestId, type, users) => {
    if(window.tabname == 'users') {
      var usersHtml = '';
      for (const adminId in users) {
        var user = users[adminId]
        usersHtml += 
        '<tr>'+
          '<td>'+ user.id+'</td>'+
          '<td>' + user.firstname + ' ' + user.lastname +'</td>'+
          '<td>' + (user.gender == 'male' ? 'Male' : 'Female') + '</td>'+
          '<td class="warning">'+ user.created_at + '</td>'+
          '<td class="primary">Details</td>'+
        '</tr>\n';
      }
      $('#users-tbody').html(usersHtml);
    }
  });
});

window.changeTab = (element) => {
  setTab(element.id.replaceAll('sidebar-menu-', ''));
}
