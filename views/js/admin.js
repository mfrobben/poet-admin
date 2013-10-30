requirejs.config({

	baseUrl: '/js',

	paths: {
		jquery: 'vendor/jquery-1.8.3',
        bootstrap: 'vendor/bootstrap/js/bootstrap.min'
	},

    shim: {
        bootstrap: {
            deps: ['jquery']
        }
    }

});

require(['jquery', 'bootstrap'], function($, Mustache, template) {

    $('#createForm')[0].reset();

    $(".btn-create-post").click(function() {
        createPost();
    });

    $('.edit-post').click(function(e){
        var id = $(this).attr('data-id')
        $.ajax({
            type: "GET",
            url: "/admin/post/" + id,
            dataType: "json",
            success: function(data, textStatus, jqXHR) {
                $('#inputEditCategory').val(data.category)
                $('#inputEditTitle').val(data.title)
                $('#inputEditTags').val(data.tags)
                $('#inputEditBody').val(data.raw)
                $('#inputEditFilename').val(id)
                $('.editModalLabel').html('You are editing ' + id + '.md')
                $('.btn-edit-post').attr('data-id', id)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });

    })

    $('.delete-post').click(function(e){
        var id = $(this).attr('data-id')
        console.log(id)
        $('.deleteModalLabel').html('Are you sure you want to delete ' + id + '.md ?')
        $('.btn-del-post').attr('data-id', id)
    })

    $(".btn-edit-post").click(function(e) {
        editPost(e);
    });

    $(".btn-del-post").click(function(e) {
        deletePost(e);
    });

    function createPost(){
        // will create a modal edit window with a save button
        $.ajax({
            type: "POST",
            url: "/admin/post",
            dataType: "json",
            data: {
                category : $('#inputCategory').val(),
                tags : $('#inputTags').val(),
                title : $('#inputTitle').val(),
                body : $('#inputBody').val(),
                filename: $('#inputFilename').val()
            },
            success: function(data, textStatus, jqXHR) {
                window.location.reload()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
    }

    function editPost(e){
        // will create a modal edit window with a save button
        var id = $(e.currentTarget).data("id")
        $.ajax({
            type: "PUT",
            url: "/admin/post/" + id,
            dataType: "json",
            data: {
                category : $('#inputEditCategory').val(),
                title : $('#inputEditTitle').val(),
                tags: $('#inputEditTags').val(),
                body: $('#inputEditBody').val(),
                filename: $('#inputEditFilename').val()
            },
            success: function(data, textStatus, jqXHR) {
                window.location.reload()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
    }

    function deletePost(e){
        // a delete button should exist to kill an post

        var id = $(e.currentTarget).data("id")
        $.ajax({
            type: "DELETE",
            url: "/admin/post/" + id,
            success: function(data, textStatus, jqXHR) {
                window.location.reload()
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        });
    }
});
