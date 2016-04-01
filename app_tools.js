/**
 *audtor edilson laverde
 * Convert an image
 * to a base64 string
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
paidagogo = {
    iframe: "#editor",
    editor: {
        lienzo: "#lienzo",
        name_start:"div",
        background: "#fondo",
        class_edit: ".box",
        n_divs: 0
    },
    fondo: function(img) {
        $(this.iframe).contents().find(this.editor.background).css("background-image", "url(" + img + ")");
    },
    get_capa:function(width,heigt){
        this.editor.n_divs += 1;
        var resizable = $('<div/>', {'id':"C"+this.editor.name_start+ this.editor.n_divs, 'class': 'drsElement','width':width,'height':heigt});
        resizable.css({"position":"absolute","left":"15px","top":"15px"});
        var move = $('<div/>', {'class': 'drsMoveHandle'});
        move.attr("data-id","#C"+this.editor.name_start+ this.editor.n_divs);
        var editable = $('<div/>', {'class': 'box','contenteditable' :true,'id':this.editor.name_start+ this.editor.n_divs,'width':"100%",'height':"100%"});
        editable.css({"outline":"0px",'display':'block'});
        $(resizable).append(move);
        $(resizable).append(editable);
        return resizable;
    },
    create_capa: function() {
        var add=this.get_capa("300px","80px");
        $(this.iframe).contents().find(this.editor.background).append(add);
        $(this.iframe).contents().find('#'+this.editor.name_start + this.editor.n_divs).text("Contenido");
        window.frames.editor.create_ck(this.editor.name_start + this.editor.n_divs);
    },
    create_img: function(img) {
        var add=this.get_capa("300px","300px");
        $(this.iframe).contents().find(this.editor.background).append(add);
        var img = $('<img/>', {src:img,'width':"100%",'height':"100%"});
        img.css({'display':'block'});
        $(this.iframe).contents().find('#' + this.editor.name_start + this.editor.n_divs).append(img);
    },
    create_video: function(id) {
        var add=this.get_capa("300px","300px");
        $(this.iframe).contents().find(this.editor.background).append(add);
        var iframe = $('<iframe/>', {src:'https://www.youtube.com/embed/' + id,'allowfullscreen':'','frameborder':0,'width':"100%",'height':"100%"});
        iframe.css({'display':'block'});
        $(this.iframe).contents().find('#' + this.editor.name_start + this.editor.n_divs).append(iframe);
    },
    id_youtuebe: function(t) {
        var e = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
            i = t.match(e);
        return i && 11 == i[7].length ? i[7] : void alert("Url incorrecta")
    },
    get_code: function() {
        return ($(this.iframe).contents().find(this.editor.lienzo).html());
    },
    convertImgToBase64: function(url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback.call(this, dataURL);
            canvas = null;
        };
        img.src = url;
    },
    descargarArchivo: function(contenidoEnBlob, nombreArchivo) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            save.download = nombreArchivo || 'archivo.dat';
            var clicEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            save.dispatchEvent(clicEvent);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(contenidoEnBlob);
    },
    //Genera un objeto Blob con los datos en un archivo TXT
    generarTexto: function(datos) {
        var texto = [];
        texto.push(datos);
        //El contructor de Blob requiere un Array en el primer parámetro
        //así que no es necesario usar toString. el segundo parámetro
        //es el tipo MIME del archivo
        return new Blob(texto, {
            type: 'text/plain'
        });
    }
}
$(function() {
    //abrir fondo//
    $('#myModal1').on('shown.bs.modal', function() {
        services_images("#library_img1", '#myModal1', function(url) {
            paidagogo.convertImgToBase64(url, function(base64Img) {
                paidagogo.fondo(base64Img);
                $('#myModal1').modal('toggle');
            });
        });
    });
    //abrir imagenes//
    $('#myModal2').on('shown.bs.modal', function() {
        services_images("#library_img2", '#myModal2', function(url) {
            paidagogo.convertImgToBase64(url, function(base64Img) {
                paidagogo.create_img(base64Img);
                $('#myModal2').modal('toggle');
            });
        });
    });
    //Crear nueva capa//
    $('#new_capa').on({
        click: function() {
            paidagogo.create_capa();
        }
    });
    //crear code//
    $('.download').on({
        click: function() {
            $(paidagogo.iframe).contents().find(paidagogo.editor.class_edit).attr('contenteditable', 'false');
            paidagogo.descargarArchivo(paidagogo.generarTexto(paidagogo.get_code()), 'paidagogo.html');
            $(paidagogo.iframe).contents().find(paidagogo.editor.class_edit).attr('contenteditable', 'true');
        }
    });
    //insertar videos//
    $('#insertYT').on({
        click: function() {
            paidagogo.create_video(paidagogo.id_youtuebe($("#url").val()));
            $('#myModal4').modal('toggle');
        }
    });
});
function services_images(idlibrary, modal, fn) {
    $(idlibrary).html("");
    $.getJSON("services/services_list_img.php", function(data) {
        var items = [];
        $.each(data, function(i, imagenes) {
            items.push('<div  style="height:70px;"  class="col-sm-6 col-md-3"><a href="#" class="thumbnail imgs"><img width="60" src="' + imagenes.url.replace("../", "") + '" alt="..."></a></div>');
        });
        $("<ul/>", {
            "class": "my-new-list",
            height: "100%",
            html: items.join("")
        }).appendTo(idlibrary);
        $('.imgs img').on({
            click: function() {
                fn($(this).attr("src"));
            }
        });
    }).done(function(data) {
        console.log("second success");
    }).fail(function(data) {
        console.log("error" + data);
    }).always(function(data) {
        console.log("complete");
    });
}