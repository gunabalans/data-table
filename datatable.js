/**
 * Netkathir data table 
 * 
 * @Example: add id to table
 * 
 * Add page size select box where required
 *      <select
 *         onchange="Netkathir.paging()"
 *         class="form-control sm"
 *         id="pagesize"
 *         style="width: 60px">
 *         <option selected="selected" value="10">10</option>
 *         <option value="25">25</option>
 *         <option value="50">50</option>
 *         <option value="100">100</option>
 *         <option value="500">500</option>
 *       </select>
 *
 * add paging container where u want
 * <nav id="pagination"></nav>
 * 
 *   Call paging onload (default values - you can change)
 *      tableId: "#data-table1",
 *      getPageSizeFrom: "#pagesize",
 *      paginationContainer: "#pagination"  
 *  
 *   <script>
 *     Netkathir.start({
 *       tableId: "#data-table1",
 *       getPageSizeFrom: "#pagesize",
 *       paginationContainer: "#pagination"
 *     });
 *   </script>
 * 
 * @author gunabalans@gmail.com
 * @site https://www.netkathir.com
 */
const Netkathir = {

    tableId: "#data-table",
    getPageSizeFrom: "#pagesize",
    paginationContainer: "#pagination",
    pagingButtonForground: "btn-light",
    pagingButtonActive: "bg-primary",

    //pagination current page    
    currentpage: 1,

    start: function (params) {

        if (params.getPageSizeFrom) {
            this.getPageSizeFrom = params.getPageSizeFrom;
        }

        if (this.tableId) {
            this.tableId = params.tableId;
        }

        if (this.paginationContainer) {
            this.paginationContainer = params.paginationContainer;
        }


        this.init();
        this.paging();
    },
    getPageSize: function () {
        let ps = document.querySelector(this.getPageSizeFrom).value;
        return parseInt(ps);
    },
    init: function () {
        let trs = document.querySelectorAll(this.tableId + " tbody tr");

        for (const tr of trs) {
            tr.setAttribute('class', 's');
        }
        trs = null;
    },
    ft: function (t, j) {

        var trs = document.querySelectorAll(this.tableId + " tr.s");
        var totalRow = trs.length;
        var filter = t.value.toUpperCase();

        //set starting point
        for (i = 0; i < totalRow; i++) {
            var td = trs[i].getElementsByTagName("td")[j];
            if (td) {
                var txtValue = td.textContent || td.innerText;

                trs[i].removeAttribute('class');
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    trs[i].style.display = "";
                    trs[i].setAttribute('class', 's');
                } else {
                    trs[i].style.display = "none";
                }
            }
        }

        trs = null;
        //call paging after filter
        this.paging();
    },
    ftreset: function () {
        this.init();

        //column search clear
        let cols = document.querySelectorAll("input.colsearch");
        for (const col of cols) {
            col.value = '';
        }
        //call paging after filter
        this.paging();
    },

    filterTable: function (page, pagesize) {

        var trs = document.querySelectorAll(this.tableId + " tr.s")
        var totalRow = trs.length;

        //set starting point
        var min = page;

        if (page >= totalRow) {
            min = totalRow;
        }

        var max = min + pagesize;
        if (max > totalRow) {
            max = totalRow;
        }

        for (i = 0; i < totalRow; i++) {
            if (i < min) {
                trs[i].style.display = "none";
            } else if (i >= max) {
                trs[i].style.display = "none";
            } else {
                trs[i].style.display = "";
            }
        }

        trs = null; //remove trs
    },
    showPage: function (t) {
        if (t != null) {
            var cp = t.textContent || t.innerText;
            var pagesize = this.getPageSize();
            var page = 0;

            if (cp == "Prev") {
                if (this.currentpage > 1) {
                    this.currentpage--;
                }
            } else if (cp == "Next") {
                const totalRow = document.querySelectorAll(this.tableId + " tr.s").length; //remove header count
                if (this.currentpage < totalRow / pagesize) {
                    this.currentpage++;
                }
            } else {
                this.currentpage = parseInt(cp);
            }


            if (this.currentpage > 1) {
                page = ((this.currentpage - 1) * pagesize) + 1;
            }

            this.filterTable(page, pagesize)

            const searchFor = "button." + this.pagingButtonActive;
            for (const li of t.parentElement.parentElement.querySelectorAll(searchFor)) {
                li.classList.remove(this.pagingButtonActive);
            }
            t.classList.add(this.pagingButtonActive);
        }
    },
    
    buttonGroup: function (pagesize, whereToStart = 1, length = 5, labelled = false, label = "Prev") {

        var div = document.createElement('div');
        div.setAttribute("class", "btn-group btn-group-lg");
        div.setAttribute("role", "group");
        var i = j = whereToStart;

        for (j; j < (whereToStart + length);) {
            var button = document.createElement('button');
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn btn-light");

            if (labelled) {
                button.innerText = label;
            } else {
                button.setAttribute("id", i);
                button.innerText = j;
            }

            button.setAttribute("onclick", "Netkathir.showPage(this)");

            div.appendChild(button);
            i = i + pagesize;
            j++;
            button = null;

        }
        label = '';//at the end of the lop label make to empty
        return div;
    },
    paging: function () {
        var pagesize = document.querySelector(this.getPageSizeFrom).value;


        if (isNaN(pagesize)) {
            pagesize = 0;
        }

        pagesize = parseInt(pagesize);

        const lengthOf = 3; //botton on each side
        const totalRow = document.querySelectorAll(this.tableId + " tr.s").length; //remove header count

        // (lengthOf - 1) to componsate last value and for loop < max value condition in pagination generation
        const starting2 = Math.ceil(totalRow / pagesize) - (lengthOf - 1);
        const starting = 1;


        let prev = this.buttonGroup(pagesize, 1, 1, true, "Prev");
        let next = this.buttonGroup(pagesize, 1, 1, true, "Next");

        let startingGroup = this.buttonGroup(pagesize, starting, lengthOf);
        let spacer1 = this.buttonGroup(pagesize, 1, 3, true, ".");
        let closingGroup = this.buttonGroup(pagesize, starting2, lengthOf);

        let div = document.createElement('div');
        div.setAttribute("class", "btn-toolbar");
        div.setAttribute("role", "toolbar");
        div.appendChild(prev);
        div.appendChild(startingGroup);
        div.appendChild(spacer1);
        div.appendChild(closingGroup);
        div.appendChild(next);

        //list view

        let pagination = document.querySelector(this.paginationContainer);
        pagination.innerHTML = ''; //clear prev list view
        pagination.appendChild(div);
        startingGroup = null;
        closingGroup = null;
        prev = null;
        next = null;
        spacer1 = null;
        div = null; // just dereferencing ul element
        //filter initially
        this.filterTable(0, pagesize)
    },

};


/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * @author Dmitriy Karpov
 * https://codepen.io/karpovsystems
 * * * * * * * * * * * * * * * * */

var Pagination = {

    code: '',

    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function (data) {
        data = data || {};
        Pagination.size = data.size || 300;
        Pagination.page = data.page || 1;
        Pagination.step = data.step || 3;
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<a>' + i + '</a>';
        }
    },

    // add last page with separator
    Last: function () {
        Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
    },

    // add first page with separator
    First: function () {
        Pagination.code += '<a>1</a><i>...</i>';
    },



    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function () {
        Pagination.page = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function () {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },



    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function () {
        var a = Pagination.e.getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },

    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function (e) {
        var nav = e.getElementsByTagName('a');
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);
    },

    // create skeleton
    Create: function (e) {

        var html = [
            '<a>&#9668;</a>', // previous button
            '<span></span>',  // pagination container
            '<a>&#9658;</a>'  // next button
        ];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
    },

    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};




