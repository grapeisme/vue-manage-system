<template>
    <el-container id="id_mark_detail">
        <el-header style="height:80px">
            <div style="float:right">
                    <el-button size="small" type="primary" @click="onClickStep(g_step_index-1)" icon="el-icon-arrow-left">上一步</el-button>
                    <el-button size="small" type="primary" @click="onClickStep(g_step_index+1)">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </div>
            <div style="margin-right:220px">
                    <el-steps  :active="g_step_index" finish-status="success" align-center>
                        <el-step title="设定标记样本"></el-step>
                        <el-step title="标记网页"></el-step>
                        <el-step title="查看样本集合"></el-step>
                        <el-step title="审核并发布"></el-step>
                    </el-steps>
            </div>
        </el-header>

        <el-main>
            <!-- step 0 -->
            <el-row :gutter="5" v-show="g_step_index == 0">
                <el-col :span="12" :offset="6" style="margin-top:2em; line-height:60px;">
                    <h4 style="color:#dd4b39">即将从这些样本开始标记，完成对同类网页的结构化设定</h4>
                    <div>1.选择网页类型</div>
                    <div>
                        <el-radio-group v-model="g_page_type" style="line-height:30px; padding:0px 10px;">
                            <el-radio v-for="item in g_meta_category" :label="item.label" type="width:100px">{{item.show}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div>2.添加标记样本</div>
                    <el-input type="textarea" :autosize="{minRows: 10, maxRows: 30}" placeholder="每行一个URL" v-model="input_sample">
                    </el-input>
                    <el-button size="small" type="primary" plain @click="onClickStep(g_step_index+1)">开始标记</el-button>
                </el-col>
            </el-row>

            <!-- step 1 -->
            <el-row :gutter="10" v-show="g_step_index == 1">
                <el-col :span="16">
                    <iframe id="id_detail_iframe" @load="onChildLoad" frameborder=0 name="showHere" scrolling=auto :src="sel_data.url"></iframe>
                </el-col>
                <el-col :span="8" style="margin-top:10px">
                    <div>我的数据项</div>
                    <pre>{{show_marked_value}}</pre>
                    <el-button size="mini" @click="handleAdd()">添加字段</el-button>
                </el-col>
            </el-row>

            <!-- step 2 -->
            <el-row :gutter="10" v-show="g_step_index == 2">
                <p>STEP_2</p>
            </el-row>

            <!-- step 3 -->
            <el-row :gutter="10" v-show="g_step_index == 3">
                <p>STEP_3</p>
            </el-row>

            <!-- step 4 -->
            <el-row :gutter="10" v-show="g_step_index == 4">
                <p>OK</p>
            </el-row>

            <ul id="id_sel_list" v-bind:style="style_sel_list" class="el-scrollbar__view el-select-dropdown__list" v-show="sel_data.sel_menu_visible && g_step_index == 1">
                    <li v-for="k in show_sel_tags" :key="k" @click="onSelKey(k)" class="el-select-dropdown__item">
                    {{k}}
                    </li>
            </ul>

        </el-main>
        <el-footer>
        </el-footer>

    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 页面全局信息
                g_step_cnt: 4,
                g_step_index: 0,
                g_meta_category: [
                    {label: "news", show: "新闻"},
                    {label: "article", show: "文章"},
                    {label: "video", show: "视频"},
                    {label: "image", show: "图片"},
                    {label: "atlas", show: "图集"},

                    {label: "blank", show: "空白"},
                ],
                g_page_type: "blank",

                // step0
                input_sample: "",

                // 标记信息
                mark_dict: {
                    title: "hello world",
                    author: "grape"
                },
                // 正在选中处理的数据
                sel_data: {
                    // iframe中数据
                    //url: "http://XXX:8360/region_tool_for_wap/local_get.php?url=" + encodeURIComponent('http://www.grapeisme.com/blog/?p=17'),
                    url: "/local/blog/?p=17",   // debug
                    beg_node: null,
                    end_node: null,

                    // 弹出框
                    sel_menu_visible: false,
                    sel_tag_key: "",
                },

                // style
                style_sel_list: {
                    left: "200px",
                    top: "300px",
                },
            }
        },
        created(){
            //this.getData();
        },
        computed: {
            show_marked_value: function() {
                var str = JSON.stringify(this.mark_dict, null, '    ');
                return str;
            },
            show_sel_tags: function() {
                var a = [];
                for (var k in this.mark_dict) {
                    a.push(k);
                }
                return a;
            },
        },
        watch: {
            ifr_mouseup: {
                handler (curVal,oldVal){
　　　　　　　　　　conosle.log("watch child_info", curVal,oldVal);
　　　　　　　　},
                deep: true,
            },
        },
               
        methods: {
            getData(){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.url = '/ms/table/list';
                };
                self.$axios.post(self.url, {page:self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            handleAdd: function() {
                var n = clone_dict(this.mark_dict);  // watch 不会监听新增字段
                n.name = 1;
                this.mark_dict = n;
            },

            onSelKey: function(k) {
                this.sel_data.sel_tag_key = k;
                this.sel_data.sel_menu_visible = false;
            },

            onClick: function(ev) {
            },

            onClickStep: function(index) {
                if (index < 0)
                    index = 0;
                else if (index >= this.g_step_cnt)
                    index = this.g_step_cnt - 1;
                this.g_step_index = index;
            },

            onChildLoad: function() {
                console.log("onChildLoad");

                // set listener
                window.addEventListener('message', this.mouseInChild, false)

                // add event listener
                var ifr = this.getChild();
                var doc = ifr.contentWindow.document;

                doc.body.addEventListener("mouseup", function(ev) {
                    console.log("mouseup in child", ev);

                    // 此时在iframe的上下文中
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();
                    ev.preventDefault();

                    // set uniq attr
                    var sel_node = ev.toElement;
                    var uniq_id =  genUniqAttrVal();
                    sel_node.setAttribute('_spider_attr_hide_up', uniq_id)

                    var msg = {
                        type: "mouseup",
                        _spider_attr_hide_up: uniq_id,
                        x: ev.clientX,
                        y: ev.clientY,
                    };

                    window.parent.top.postMessage(msg, "*");
                    //window.parent.appobj.ifr_mouseup = ev;
                });
                doc.body.addEventListener("mousedown", function(ev) {
                    console.log("mousedown in child", ev);

                    // 此时在iframe的上下文中
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();

                    // set uniq attr
                    var sel_node = ev.toElement;
                    var uniq_id =  genUniqAttrVal();
                    sel_node.setAttribute('_spider_attr_hide_down', uniq_id)

                    var msg = {
                        type: "mousedown",
                        _spider_attr_hide_down: uniq_id,
                        x: ev.clientX,
                        y: ev.clientY,
                    };
                    window.parent.top.postMessage(msg, "*");
                });
                doc.body.addEventListener("click", function(ev) {
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();
                    ev.preventDefault();
                    return false;
                });
            },

            mouseInChild: function(msg) {
                console.log("mouse work in parent", msg);
                var tp = msg.data.type;
                var doc = this.getChild().contentWindow.document;
                if (!doc)
                    return;

                var pos = {x:0, y:0};
                if (tp == "mousedown") {
                    var node = getNodeByAttr(doc.body, '_spider_attr_hide_down', msg.data._spider_attr_hide_down);

                    this.sel_data.beg_node = node;
                    this.sel_data.end_node = null;

                    pos.x = msg.data.x;
                    pos.y = msg.data.y;
                }
                if (tp == "mouseup") {
                    var node = getNodeByAttr(doc.body, '_spider_attr_hide_up', msg.data._spider_attr_hide_up);

                    this.sel_data.end_node = node;

                    pos.x = msg.data.x;
                    pos.y = msg.data.y;
                }

                if (!this.sel_data.beg_node || !this.sel_data.end_node) {
                    this.sel_data.sel_menu_visible = false;
                    return;
                }
                
                // calc node press
                var xp = getSelXpath(this.sel_data.beg_node, this.sel_data.end_node);
                console.log(this.sel_data.beg_node, this.sel_data.end_node, xp);

                if (!xp)  {
                    this.sel_data.sel_menu_visible = false;
                    return;
                }

                // pop selector
                var ifr_pos = getAbsolutePos("id_detail_iframe");
                //var header = document.getElementById('id_header');

                this.style_sel_list.left = pos.x + ifr_pos.x + "px";
                this.style_sel_list.top = pos.y + ifr_pos.y + "px";
                //this.style_sel_list.top = pos.y + ifr_pos.y - header.offsetHeight + "px";
                this.sel_data.sel_menu_visible = true;
            },

            mousedownInChild: function(event) {
                console.log("mousedown in parent", event);
                this.sel_data.beg_node = event.toElement;
                this.sel_data.end_node = null;

                this.sel_data.sel_menu_visible = false;
            },

            extractMark: function() {
            },

            getChild: function() {
                var ifr = document.getElementById('id_detail_iframe');
                return ifr;
            },

            init: function() {  // 可用在 iframe @load 中
                const ifr = this.getChild(); 
                var height = ifr.contentWindow.document.body.offsetHeight;
                if (height < 600)
                    height = 600;
                ifr.height = height + "px";
            },
        },

    }
</script>

<style scoped>
    .el-header {
        margin: 0;
        padding:20px 20px 20px 10px;
        box-shadow: 0 6px 6px rgba(0,0,0,0.3);
        background-color: #f3f3f3;
        z-index: 99;
    }
    .el-main {
        padding-top:0;
    }
    .el-row {
        margin-bottom:10px;
    }
    .el-radio {
        line-height:2em;
        width:100px;
        margin-left: 0px;
    }
    iframe {
        width:100%;
        min-height:600px;
    }
    #id_sel_list {
        z-index:9999;
        -webkit-border-radius: 0;
        border-radius: 0;
        box-shadow: 0 10px 10px rgba(0,0,0,0.4);
        -webkit-transition: opacity .218s;
        transition: opacity .218s;
        background: #fff;
        border: 1px solid rgba(0,0,0,.2);
        border-radius:2px;
        cursor: default;
        font-size: 15px;
        margin: 0;
        padding: 6px 0px;
        outline: none;
        position: absolute;
    }
    #id_sel_list>li {
        font-size: 100%;
        color: #333;
        cursor: pointer;
        list-style: none;
        margin: 0;
        padding: 6px 4em 6px 20px;
        white-space: nowrap;
        line-height: 20px;
    }
    
    #id_sel_list>li:hover{
        background-color: #9a9999;
        color:white;
    }
</style>
