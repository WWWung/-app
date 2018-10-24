// const fs = require("fs");
// const mysql = require("mysql");
// const path = require("path");


// window.$ = window.jQuery = require('./js/jquery-3.3.1.min.js');
var list = null;
let form;
let table;

layui.use(["form", "table"], () => {
    table = layui.table;
    form = layui.form;
    form.render();
    list = table.render({
        cols: [[
            {field: "name", title: "药品名称", width: 120, align: "center"},
            {field: "no", title: "编号", width: 120, align: "center"},
            {field: "in", title: "入库量", width: 120, align: "center"},
            {field: "out", title: "出库量", width: 120, align: "center"},
            {field: "count", title: "库存量", width: 120, align: "center"},
            {field: "inTime", title: "入库时间", width: 120, align: "center"},
            {field: "outTime", title: "出厂日期", width: 120, align: "center"},
            {field: "days", title: "有效期", width: 120, align: "center"},
            {field: "endTime", title: "到期时间", width: 120, align: "center"},
            {field: "tips", title: "到期提醒", width: 120, align: "center"},
        ]],
        elem: "#list",
        // page: true,
        // limit: 
    });
    list.reload({
        data: []
    })
})
