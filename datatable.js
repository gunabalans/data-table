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
    lengthOfPageGroup: 3,
    currentpage: 1,
    prevPage: 1,
    startingPageNoG1: 1,
    startingPageNoG2: 1,


    start: function (params) {

        if (params.getPageSizeFrom) {
            this.getPageSizeFrom = params.getPageSizeFrom;
        }

        if (params.tableId) {
            this.tableId = params.tableId;
        }

        if (params.paginationContainer) {
            this.paginationContainer = params.paginationContainer;
        }


        this.init();
        this.initStartPageNoG2();//set the stating page of Last part (G2) of pageination
        this.paging();
    },
    getPageSize: function () {
        var ps = document.querySelector(this.getPageSizeFrom).value;
        ps = parseInt(ps);
        if (Number.isInteger(ps)) {
            return ps;
        }
        return 10;
    },
    getTotalRows: function () {
        return document.querySelectorAll(this.tableId + " tbody tr.s").length;
    },
    initStartPageNoG2: function () {
        const totalRow = this.getTotalRows();
        const pagesize = this.getPageSize();
        // (lengthOf - 1) to componsate last value and for loop < max value condition in pagination generation
        this.startingPageNoG2 = Math.ceil(totalRow / pagesize) - (this.lengthOfPageGroup - 1);
    },
    init: function () {
        let trs = document.querySelectorAll(this.tableId + " tbody tr");

        for (const tr of trs) {
            tr.setAttribute('class', 's');
        }
        trs = null;
    },
    ft: function (t, j) {

        var trs = document.querySelectorAll(this.tableId + " tbody tr.s");
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

        var trs = document.querySelectorAll(this.tableId + " tbody tr.s")
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
                    this.prevPage = this.currentpage;
                    this.currentpage--;

                    if (this.startingPageNoG1 > 1) {
                        this.startingPageNoG1--;
                    }

                    if ((this.startingPageNoG1 + this.lengthOfPageGroup) < this.startingPageNoG2) {
                        this.startingPageNoG2--;
                    }

                    this.paging();
                }
            } else if (cp == "Next") {
                const totalRow = document.querySelectorAll(this.tableId + " tbody tr.s").length; //remove header count
                if (this.currentpage < totalRow / pagesize) {
                    this.prevPage = this.currentpage;
                    this.currentpage++;
                }

                if (this.startingPageNoG2 <= (Math.ceil(totalRow / pagesize) - this.lengthOfPageGroup)) {
                    this.startingPageNoG2++;
                }

                if ((this.startingPageNoG1 + this.lengthOfPageGroup) < this.startingPageNoG2) {
                    this.startingPageNoG1++;
                }


                this.paging();

            } else {
                if (Number.isInteger(parseInt(cp))) {
                    this.prevPage = this.currentpage;
                    this.currentpage = parseInt(cp);
                }
            }

            if (this.currentpage > 1) {
                page = ((this.currentpage - 1) * pagesize) + 1;
            }

            if (Number.isInteger(parseInt(cp))) {
                this.filterTable(page, pagesize)
            }



            const searchFor = "button." + this.pagingButtonActive;
            var pr = t.parentElement.parentElement.querySelectorAll(searchFor);
            for (const li of pr) {
                li.classList.remove(this.pagingButtonActive);
            }

            if (Number.isInteger(parseInt(cp))) {
                t.classList.add(this.pagingButtonActive);
            }
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
                if (this.currentpage == j) {
                    button.classList.add(this.pagingButtonActive)
                }
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
        var pagesize = this.getPageSize();
        var page = 1;
        const lengthOf = 3; //botton on each side
        const totalRow = document.querySelectorAll(this.tableId + " tbody tr.s").length; //remove header count


        let prev = this.buttonGroup(pagesize, 1, 1, true, "Prev");
        let next = this.buttonGroup(pagesize, 1, 1, true, "Next");


        let startingGroup = this.buttonGroup(pagesize, this.startingPageNoG1, lengthOf);
        let spacer1 = this.buttonGroup(pagesize, 1, 2, true, ".");
        let closingGroup = this.buttonGroup(pagesize, this.startingPageNoG2, lengthOf);

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

        if (this.currentpage > 1) {
            page = ((this.currentpage - 1) * pagesize) + 1;
        }

        this.filterTable(page, pagesize)

    }

};
