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
 */
const Netkathir = {

    tableId: "#data-table",
    getPageSizeFrom: "#pagesize",
    paginationContainer: "#pagination",

    start: function (params) {
        this.getPageSizeFrom = params.getPageSizeFrom;
        this.tableId = params.tableId;
        this.paginationContainer = params.paginationContainer;
        this.init();
        this.paging();
    },

    init: function () {
        let trs = document.querySelectorAll(this.tableId + " tbody tr");

        for (const tr of trs) {
            tr.setAttribute('class', 's');
        }
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
            var pr = event.target.parentElement;
            for (const li of pr.parentElement.querySelectorAll("li.active")) {
                li.classList.remove("active");
            }
            pr.classList.add("active");
            pr = null;
        }

    },
    paging: function () {
        var pagesize = document.querySelector(this.getPageSizeFrom).value;

        if (isNaN(pagesize)) {
            pagesize = 0;
        }

        pagesize = parseInt(pagesize);

        var trs = document.querySelectorAll(this.tableId + " tr.s");
        var totalRow = trs.length; //remove header count

        var listView = document.createElement('ul');
        listView.setAttribute("class", "pagination");

        var j = 1;
        for (var i = 0; i < totalRow;) {
            var listViewItem = document.createElement('li');
            listViewItem.setAttribute("class", "page-item");
            var button = document.createElement('a');
            button.setAttribute("class", "page-link");
            button.setAttribute("id", i);

            button.setAttribute("onclick", "Netkathir.filterTable(" + i + "," + pagesize + ",event)");
            button.innerHTML = j;

            listViewItem.appendChild(button);
            listView.appendChild(listViewItem);
            i = i + pagesize;
            j++;
        }

        let pagination = document.querySelector(this.paginationContainer);
        pagination.innerHTML = ''; //clear prev list view
        pagination.appendChild(listView);
        listView = null; // just dereferencing ul element
        //filter initially
        this.filterTable(0, pagesize)
    }
};