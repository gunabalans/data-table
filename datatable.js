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
    filterTable: function (page, pagesize, event = null) {

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
        if (event != null) {
            var pr = event.target;
            const searchFor = "button." + this.pagingButtonActive;
            for (const li of pr.parentElement.parentElement.querySelectorAll(searchFor)) {
                li.classList.remove(this.pagingButtonActive);
            }
            pr.classList.add(this.pagingButtonActive);
            pr = null;
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
            button.setAttribute("id", i);
            if (labelled) {
                button.innerText = label;
            } else {
                button.setAttribute("onclick", "Netkathir.filterTable(" + i + "," + pagesize + ",event)");
                button.innerText = j;
            }


            div.appendChild(button);
            i = i + pagesize;
            j++;
            button = null;
        }
        return div;
    },
    paging: function () {
        var pagesize = document.querySelector(this.getPageSizeFrom).value;

        if (isNaN(pagesize)) {
            pagesize = 0;
        }

        pagesize = parseInt(pagesize);

        var totalRow = document.querySelectorAll(this.tableId + " tr.s").length; //remove header count
        var starting = 1;
        var lengthOf = 5; //botton on each side

        var prev = this.buttonGroup(pagesize, 1, 1, true, "Prev");
        var next = this.buttonGroup(pagesize, 1, 1, true, "Next");

        var startingGroup = this.buttonGroup(pagesize, starting, lengthOf);
        var midGroup = this.buttonGroup(pagesize, 1, 3, true, ".");
        var closingGroup = this.buttonGroup(pagesize, (totalRow - (lengthOf * pagesize)), lengthOf);

        var div = document.createElement('div');
        div.setAttribute("class", "btn-toolbar");
        div.setAttribute("role", "toolbar");
        div.appendChild(prev);
        div.appendChild(startingGroup);
        div.appendChild(midGroup);
        div.appendChild(closingGroup);
        div.appendChild(next);

        //list view

        let pagination = document.querySelector(this.paginationContainer);
        pagination.innerHTML = ''; //clear prev list view
        pagination.appendChild(div);
        startingGroup = null;
        midGroup = null;
        closingGroup = null;
        prev = null;
        next = null;
        div = null; // just dereferencing ul element
        //filter initially
        this.filterTable(0, pagesize)
    }
};