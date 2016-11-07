'use strict'

const getlist = function() {
    $.ajax({
        url: "/todos",
        type: 'get',
        dataType: 'json',
        contentType: 'json',
        success: function(data) {


            data.forEach(function(todoItem) {
                let checked = '';
                if(todoItem.checked){
                    checked = 'checked';
                }
                let li = $('<li>' + todoItem.message + '<input type="checkbox" class="checkbox" '+checked+' id='+todoItem.id+'>'  +"   "   + '<button class="delete" id='+todoItem.id+'>delete me</button>' + '</li>');

                $('#todolist').append(li);

            });
        },
        error: function (data) {
            alert('Error ');
        }



    });
}


$('#searchbtn').on('click', function(){

    const searchtext = $('#searchtxtbx').val();
    $('#todolist').html(' ');

    $.ajax({
        url: "/todos",
        type: 'get',
        dataType: 'json',

        success: function(data) {


            const filteredlist = data.filter(function(todoItem) {

                if (!searchtext || todoItem.message.toLowerCase().indexOf(searchtext.toLowerCase()) >= 0)
                    return true;
                else
                    return false;
            });
            filteredlist.forEach(function(todoItem) {
                let checked = '';
                if(todoItem.checked){
                    checked = 'checked';
                }

                let li = $('<li>' + todoItem.message + '<input type="checkbox"  class="checkbox" '+checked+' id='+todoItem.id+'>' +"   "+ '<button class="delete" id='+todoItem.id+'>delete me</button>' + '</li>');

                $('#todolist').append(li);


            });
        },
        error: function (data) {
            alert('Error ');
        }
    });


});
$('#create').on('click', function() {
    const val = $('#msgtxtbx').val();
    if (val==="") { return ''}
    $('#msgtxtbx').val(''); // clear the textbox

    $.ajax({
        url: "/todos",
        type: 'post',
        dataType: 'json',
        data: JSON.stringify({
            message: val,
            completed: false
        }),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            // refresh the list (re-run the search query)
            $('#todolist').html('');
            getlist();

        },
        error: function (data) {
            alert('Error creating todo');
        }
    });
})

$("#todolist").on('change','.checkbox', function(e){

    $.ajax({                                       // update
        url         : "/todos",
        type        : 'put',
        dataType    : 'json',
        data        : JSON.stringify({
            checked: e.target.checked,
            id : e.target.id,
        }),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {

        },
        error       : function(data) {
            alert('Error creating todo');
        }
    });
});

$('#todolist').on('click','.delete', function(e) {

    $.ajax({                            // delete
        url: "/todos/" + e.target.id,
        type: 'DELETE',
        success: function (data) {
            $('#todolist').html(' ');
            getlist();
        },
        error: function (data) {
            alert('Error deleting the item');
        }
    });
});

getlist();