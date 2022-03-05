# data-table

Convert existing table to paginated table, boostrap based style
 

 ## Netkathir data table 
  
  @Example: add id to table
  
  Add page size select box where required
  ```HTML
       <select
          onchange="Netkathir.paging()"
          class="form-control sm"
          id="pagesize"
          style="width: 60px">
          <option selected="selected" value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
        </select>
 ```
  add paging container where u want
  ```HTML
  <nav id="pagination"></nav>
 ``` 
    Call paging onload (default values - you can change)
      
       tableId: "#data-table1",
       getPageSizeFrom: "#pagesize",
       paginationContainer: "#pagination"  
   ```HTML
    <script>
      Netkathir.start({
        tableId: "#data-table1",
        getPageSizeFrom: "#pagesize",
        paginationContainer: "#pagination"
      });
    </script>
```
![image](https://user-images.githubusercontent.com/11496339/156862663-b9bd4133-29f6-441b-811d-5070418d3504.png)


# License
data-table is opensource software licensed under the <a href="https://opensource.org/licenses/MIT">MIT</a> license.

 ** @author gunabalans@gmail.com ** 
 ** @site https://www.netkathir.com **
