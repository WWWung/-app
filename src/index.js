// const fs = require("fs");
// const mysql = require("mysql");
// const path = require("path");

// window.$ = window.jQuery = require('./js/jquery-3.3.1.min.js');

/*  药品信息
    models:
        {
            药品A: {
                no: xxx,
                出厂时间: {
                    in: xxx, 入库量
                    out: xxx, 出库量
                    inTime: xxx
                }
            }
        }
*/


//  药品名称
var names = ["阿莫西林", "板蓝根"];
var data = {};



let xxListObj = null;
let kcListObj = null;
let gqListObj = null;
var xxList = [];
var kcList = [];
let form;
let table;
let laydate;

$("#openNewNameBox").on("click", function() {
    $("#setNewName").css("display", "flex");
})
$("#saveNewName").on("click", confirmNewName);
$("#closeNewName").on("click", closeNewNameBox);
$("#inRepertory").on("click", inRepertory);
$("#outRepertory").on("click", outRepertory);

$("#setDetail").on("click", function() {
    $("#newWrap").css("display", "flex");
})
$("#saveDetails").on("click", saveDetails);
$("#closeDetails").on("click", closeDetails);

$("#search").on("click", search);

$("#showKcList").on("click", function() {
    $("#list1").show();
    $("#list2").hide();
    $("#list3").hide();
    showKcList();
});
$("#showXxList").on("click", function() {
    $("#list1").hide();
    $("#list2").hide();
    $("#list3").show();
    showDetailList();
});

layui.use(["form", "table", "laydate"], () => {
    table = layui.table;

    form = layui.form;
    form.render();
    form.on("select(ckName)", getOutTimeUnderName);
    form.on("select(ckOutTime)", ckShowCount)

    laydate = layui.laydate;
    laydate.render({
        elem: "#rkOutTime",

    })
    laydate.render({
        elem: "#searchStartTime",

    })
    laydate.render({
        elem: "#searchEndTime",

    })
    xxListObj = table.render({
        cols: [
            [
                { field: "name", title: "药品名称", width: 120, align: "center" },
                { field: "no", title: "编号", width: 120, align: "center" },
                { field: "in", title: "入库量", width: 120, align: "center" },
                { field: "out", title: "出库量", width: 120, align: "center" },
                { field: "count", title: "库存量", width: 120, align: "center" },
                { field: "inTime", title: "入库时间", width: 120, align: "center" },
                { field: "outTime", title: "出厂日期", width: 120, align: "center" },
                { field: "days", title: "有效期", width: 120, align: "center" },
                { field: "endTime", title: "到期时间", width: 120, align: "center" },
                {
                    field: "tips",
                    title: "到期提醒",
                    width: 120,
                    align: "center",
                    templet: function(o) {
                        var index = o.LAY_TABLE_INDEX;
                        var color = "";
                        var tips = Number.parseInt(o.tips);
                        if (o.tips === "已过期") {
                            color = "rgba(236, 37, 37, .5)";
                        } else if (tips < 30 && tips > 0) {
                            color = "rgba(28, 133, 73, .5)";
                        } else if (tips < 60 && tips >= 30) {
                            color = "rgba(145, 233, 230, .5)";
                        }
                        console.log(this)
                        $($("#xxList")[0].nextElementSibling).find("tr").eq(index).css("background-color", "red");
                        return o.tips;
                    }
                }
            ]
        ],
        elem: "#xxList",
        limits: [10, 40, 80, 200],
        page: true
    });
    kcListObj = table.render({
        cols: [
            [
                { field: "name", title: "药品名称", width: 120, align: "center" },
                { field: "no", title: "编号", width: 120, align: "center" },
                { field: "in", title: "入库量", width: 120, align: "center" },
                { field: "out", title: "出库量", width: 120, align: "center" },
                { field: "count", title: "库存量", width: 120, align: "center" }
            ]
        ],
        elem: "#kcList"
    });
    gqListObj = table.render({
        cols: [
            [
                { field: "name", title: "药品名称", width: 120, align: "center" },
                { field: "no", title: "编号", width: 120, align: "center" },
                { field: "in", title: "入库量", width: 120, align: "center" },
                { field: "out", title: "出库量", width: 120, align: "center" },
                { field: "count", title: "库存量", width: 120, align: "center" },
                { field: "inTime", title: "入库时间", width: 120, align: "center" },
                { field: "outTime", title: "出厂日期", width: 120, align: "center" },
                { field: "days", title: "有效期", width: 120, align: "center" },
                { field: "endTime", title: "到期时间", width: 120, align: "center" },
                { field: "tips", title: "到期提醒", width: 120, align: "center" }
            ]
        ],
        elem: "#gqList"
    });
    renderNames("#newName", names);
    renderNames(".name", names);
    renderCkName();
})

function renderNames(el, names) {
    var html = "<option>请选择药品名称</option>";
    names.forEach(name => {
        html += "<option value='" + name + "'>" + name + "</option>"
    })
    $(el).html(html);
    form && form.render();
}
//  新增药品名称
function confirmNewName() {
    var name = $("#newNameInput").val();
    if (name.length > 20) {
        alert("名称过长");
        return;
    }
    if (!name) {
        alert("请输入名称");
        return;
    }
    if (checkName(name)) {
        alert("名称已存在");
        return;
    }
    names.push(name);
    renderNames("#newName", names);
    renderNames(".name", names);
    closeNewNameBox();
}

function closeNewNameBox() {
    $("#newNameInput").val("");
    $("#setNewName").hide();
}
//  检查药品名称是否已经存在
function checkName(name) {
    return names.includes(name);
}

//  入库
function inRepertory() {
    var name = $("#rkName").val();
    var outTime = $("#rkOutTime").val();
    var _in = getInt("#in");
    if (!name || !outTime) {
        return alert("数据不完整");
    }
    if (data.hasOwnProperty(name)) {
        var nameItem = data[name];
        if (nameItem.hasOwnProperty(outTime)) {
            nameItem[outTime].in += _in;
        } else {
            var timeItem = {};
            timeItem.in = _in;
            timeItem.out = 0;
            timeItem.inTime = dateFormatter();
            nameItem[outTime] = timeItem;
        }
    } else {
        var nameItem = {};
        var timeItem = {};
        timeItem.in = _in;
        timeItem.out = 0;
        timeItem.inTime = dateFormatter();
        nameItem[outTime] = timeItem;
        data[name] = nameItem;
    }
    // console.log(data);
    renderCkName();
    alert("入库成功");
}

//  出库栏只展示有库存的药品名字
function renderCkName() {
    var ckNames = Object.keys(data);
    renderNames("#ckName", ckNames);
}

//  出库
function outRepertory() {
    var name = $("#ckName").val();
    var outTime = $("#ckOutTime").val();
    var out = getInt("#out");
    var count = getInt("#ckCount");
    if (out > count) {
        return alert("出库失败, 出库量超过库存量");
    }
    data[name][outTime].out += out;
    var newCount = data[name][outTime].in - data[name][outTime].out;
    $("#ckCount").val(newCount);
    alert("出库成功");
}

//  出库时选择名称出现对应的出厂日期
function getOutTimeUnderName() {
    var name = $("#ckName").val();
    var outTimes = [];
    if (data.hasOwnProperty(name)) {
        outTimes = Object.keys(data[name]);
    }
    var html = "<option>请选择出厂日期</option>";
    outTimes.forEach(name => {
        html += "<option value='" + name + "'>" + name + "</option>"
    })
    $("#ckOutTime").html(html);
    form.render();
}

//  出库时候选择名称和出厂日期后，显示对应的库存量
function ckShowCount() {
    var name = $("#ckName").val();
    var outTime = $("#ckOutTime").val();
    if (!data.hasOwnProperty(name) || !data[name].hasOwnProperty(outTime)) {
        return $("#ckCount").val("");
    }
    var count = data[name][outTime].in - data[name][outTime].out;
    $("#ckCount").val(count);
}

function getInt(el) {
    var val = $(el).val();
    var int = Number.parseInt(val);
    if (typeof int === "number" && int === int && int > 0) {
        $(el).val(int);
        return int;
    } else {
        $(el).val(0);
        return 0;
    }
}

function showDetailList() {
    xxList = [];
    for (var name in data) {
        var nameItem = data[name];
        for (var time in nameItem) {
            var item = {};
            var timeItem = nameItem[time];
            item.name = name;
            item.no = timeItem.no;
            item.in = timeItem.in;
            item.out = timeItem.out || 0;
            item.count = timeItem.in - timeItem.out;
            item.inTime = timeItem.inTime;
            item.outTime = time;
            item.days = timeItem.days || "";
            item.endTime = "";
            item.tips = "";
            if (item.days) {
                var days = item.days * 24 * 60 * 60 * 1000;
                var outTime = new Date(item.outTime).getTime();
                item.endTime = dateFormatter(days + outTime);
                var tips = days + outTime - Date.now();
                if (tips <= 0) {
                    item.tips = "已过期";
                } else {
                    item.tips = Math.round(tips / (24 * 60 * 60 * 1000));
                }
            }
            xxList.push(item);
        }
    }
    xxList.sort((a, b) => {
        if (!a.tips) {
            return -1;
        }
        if (a.tips === "已过期") {
            return -1;
        }
        return a.tips - b.tips;
    })
    xxListObj.reload({
        data: xxList
    })
}

function showKcList() {
    kcList = [];
    for (var name in data) {
        var nameItem = data[name];
        var _in = 0;
        var out = 0;
        var obj = {};
        for (var time in nameItem) {
            if (time === "days" || time === "no") {
                continue;
            }
            var timeItem = nameItem[time];
            _in += Number.parseInt(timeItem.in);
            out += Number.parseInt(timeItem.out);
            obj.no = timeItem.no;
        }
        var count = _in - out;
        obj.name = name;
        obj.in = _in;
        obj.count = count;
        obj.out = out;
        kcList.push(obj);
    }
    kcList.sort((a, b) => {
        return a.count - b.count;
    })
    kcListObj.reload({
        data: kcList
    })
}

function dateFormatter(date) {
    var time = date ? new Date(date) : new Date();
    if (time.getTime() <= 0 || isNaN(time.getTime())) {
        time = new Date();
    }
    return time.getFullYear() + "-" + add0(time.getMonth() + 1) + "-" + add0(time.getDate());
}

function add0(num) {
    if (typeof num !== "number" || isNaN(num)) {
        return 0;
    }
    return num < 10 ? "0" + num : num + "";
}

function search() {
    var val1 = $("#xxListKey").val();
    var time1 = $("#searchStartTime").val();
    var time2 = $("#searchEndTime").val();
    if (!val1 && !time1 && !time2) {
        xxListObj.reload({
            data: xxList
        });
        return;
    }
    var searchList = xxList.filter(item => {
        var flag = true;
        if (time1) {
            if (new Date(time1) > new Date(item.outTime)) {
                flag = false;
            }
        }
        if (time2) {
            if (new Date(time2) < new Date(item.outTime)) {
                flag = false;
            }
        }
        if (item.name.indexOf(val1) < 0 && !(item.no && item.no.indexOf(val1) < 0)) {
            flag = false;
        }
        return flag;
    })
    xxListObj.reload({
        data: searchList
    })
}

//  保存药品信息
function saveDetails() {
    var name = $("#detailName").val();
    if (!data.hasOwnProperty(name)) {
        return alert("库存中没有该药品");
    }
    var no = $("#no").val();
    var days = getInt("#days");
    if (!no || !days) {
        return alert("请输入有效信息");
    }
    for (var time in data[name]) {
        data[name][time].no = no;
        data[name][time].days = days;
    }
    alert("保存成功");
    closeDetails();
}

function closeDetails() {
    $("#newWrap").hide();
}