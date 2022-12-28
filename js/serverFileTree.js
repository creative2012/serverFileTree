const path = 'Sites';
var folders = {};
var id = '';
var rootNode = ''
function createNodes(x) {

    $.each(x.reverse(), function () {


        if (this.parent == 'root') {
            // create a new div element
            const nav = document.createElement("nav");
            const newDiv = document.createElement("ul");
            const newDiv2 = document.createElement("div");
            rootNode = this.id;
            nav.setAttribute('id', 'navigation');
            newDiv.setAttribute('id', this.id);
            newDiv2.setAttribute('id', 'fileView');


            // and give it some content
            const newContent = document.createTextNode(this.node);

            // add the text node to the newly created div
            const span = document.createElement("div");
            nav.appendChild(span).appendChild(newContent);

            // add the newly created element and its content into the DOM
            const currentDiv = document.getElementById("container");

            currentDiv.appendChild(nav);
            nav.appendChild(newDiv);
            currentDiv.appendChild(newDiv2);

        }
        else {
            // create a new div element
            const newDiv = document.createElement("ul");
            newDiv.setAttribute('id', this.id);
            newDiv.setAttribute('class', 'nested');


            const currentDiv = document.getElementById(this.parent);
            const newLi = document.createElement("li");
            const newSp = document.createElement("span");

            newSp.setAttribute('id', this.id + 'F');
            newSp.setAttribute('class', 'caret');
            newSp.setAttribute('data', this.path);
            newSp.setAttribute('data-parent', this.parent.replace(/\s/g, ''));
            newSp.setAttribute('data-group', this.group.replace(/\s/g, ''));
            newDiv.setAttribute('data-parent', this.parent.replace(/\s/g, ''));
            newDiv.setAttribute('data-group', this.group.replace(/\s/g, ''));
            const newContent = document.createTextNode(this.node);

            // add the text node to the newly created div
            newSp.appendChild(newContent);

            currentDiv.appendChild(newLi).appendChild(newSp);
            newLi.appendChild(newDiv);
            folders[this.id + 'F'] = this.path.replace('../request/', '');



        }
    });
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            id = this.id;


            if (!this.classList.contains("activeCaret")) {
                var test = document.querySelectorAll("[data-group]");
                var value = this.getAttribute('data-group');
                var parent = this.id;

                $.each(test, function () {
                    this.style.border = "";
                    this.style.padding = "";
                    if (this.classList.contains("activeCaret") && this.getAttribute('data-parent') != rootNode
                    && this.getAttribute('id') != id) {
                        this.classList.toggle("activeCaret");

                    }
                    if (this.classList.contains("activeCaret") && this.getAttribute('data-parent') == rootNode
                    && this.getAttribute('id') != id && this.getAttribute('data-group') != value) {
                        this.classList.toggle("activeCaret");

                    }

                    if (this.getAttribute('data-group') != value && this.getAttribute('data-group') != value + 'F') {
                        
                        if (this.classList.contains("active")) {
                            this.classList.toggle("active");

                        }
                       

                    }

                    var newTest = this.getAttribute('data-parent') + 'F';

                    if (newTest == parent) {
                        if (this.classList.contains("activeCaret")) {
                            this.classList.toggle("activeCaret");

                        }
                        if (this.classList.contains("active")) {
                            this.classList.toggle("active");

                        }
                        

                    }
                });
            }


            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("activeCaret");

            if (this.classList.contains("activeCaret")) {
                this.style.border = "dotted 1px lightgrey";
                this.style.padding = "5px";

            }

            document.getElementById('fileView').innerHTML = "";
            if (this.classList.contains("activeCaret")) {
                $.ajax({
                    type: "GET",
                    url: "request/data.php",
                    dataType: "json",
                    data: {
                        files: true,
                        path: this.getAttribute("data"),
                    },
                }).done(function (message) {
                    // console.log(message);
                    addFiles(message);
                    document.getElementById('crumbs').innerText = '...' + folders[id].replace(/\//g, ' > ');

                }).fail(function (message) {
                    console.log('fail');
                })
            }

        });



    }

};
function addFiles(x) {


    const currentDiv1 = document.getElementById('fileView');
    const newDiv1 = document.createElement("ul");
    newDiv1.setAttribute('id', 'fileList');
    currentDiv1.appendChild(newDiv1);
    const currentDiv = document.getElementById('fileList');
    const crumbs = document.createElement("div");
    crumbs.setAttribute('id', 'crumbs');
    currentDiv1.appendChild(crumbs);


    $.each(x, function () {
        // create a new div element

        const newDiv = document.createElement("li");
        newDiv.setAttribute('id', this.name.replace(/\s/g, ''));
        newDiv.setAttribute('class', 'file');

        // and give it some content
        const newLink = document.createElement('a');
        newLink.setAttribute('href', this.link);
        newLink.setAttribute('target', '_blank');
        const newIcon = document.createElement('div');
        newIcon.setAttribute('class', 'ft_' + this.ext);
        const newContent = document.createTextNode(this.name);
        const newInfo = document.createElement('span');
        const infoContent = document.createTextNode(formatBytes(this.size));

        // add the text node to the newly created div
        newLink.appendChild(newContent);
        newInfo.appendChild(infoContent);

        // add the newly created element and its content into the DOM 
        currentDiv.appendChild(newDiv).appendChild(newIcon);
        currentDiv.appendChild(newDiv).appendChild(newLink).appendChild(newInfo);


    });


}
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "request/data.php",
        dataType: "json",
        data: {
            folders: true,
            path: '../request/' + path,
        },
    }).done(function (message) {
        console.log(message);
        createNodes(message);


    }).fail(function (message) {
        console.log('fail');
    })

});
