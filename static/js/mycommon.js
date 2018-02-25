g_user = 'grape';

function isElementNode(node) {
    return node && node.nodeType == 1;
}

function getNodeByAttr(root, attr, val) {
    if (!root)
        return null;
    
    if (root.getAttribute(attr) == val)
        return root;

    for (var chd = root.firstElementChild; chd != null; chd = chd.nextElementSibling) {
        var res = getNodeByAttr(chd, attr, val);
        if (res)
            return res;
    }

    return null;
}

function getXpathInfo(sel_node) {
    if( !isElementNode(sel_node))
        return null;

    var path_arr = new Array();

    for( var node = sel_node; node != document && node != null; node = node.parentElement) {
        if( !isElementNode(node))
            continue;

        var cur_ele = _getElemInfo(node);
        cur_ele['no'] = 1;

        //for( var pre_brother = node.previousElementSibling; pre_brother != null; pre_brother = pre_brother.previousElementSibling) {
        for( var pre_brother = node.previousSibling; pre_brother != null; pre_brother = pre_brother.previousSibling) {
            if( !isElementNode(pre_brother))
                continue;

            var pre = _getElemInfo(pre_brother);
            if( pre['name'] == cur_ele['name'] && pre['id'] == cur_ele['id'] && pre['class'] == cur_ele['class']) {
                cur_ele['no'] += 1;
            }
        }
        
        path_arr.push(cur_ele);
    }

    // fmt out
    var out_str = "";
    for( var i = path_arr.length-1; i >= 0; i--) {
        var ele = path_arr[i];
        if( ele) {
            out_str += '/' + ele['name'] + '[' + ele['no'] + '^';
            out_str += ele['id'];
            out_str += '^';
            out_str += ele['class'];
            out_str += ']';
        }
    }
    
    out_str = out_str.toLowerCase();
    return out_str;
}

function _getElemInfo(node) {
    var ele = new Array();
    ele['name'] = node.nodeName;
    if(ele['name'])
        ele['name'] = ele['name'].toLowerCase();
    else
        ele['name'] = '';

    ele['id'] = node.getAttribute('id');
    if(ele['id'])
        ele['id'] = ele['id'].toLowerCase();
    else
        ele['id'] = '';

    ele['class'] = node.getAttribute('class');
    if(ele['class'])
        ele['class'] = ele['class'].toLowerCase();
    else
        ele['class'] = '';

    return ele;
}

function isParentXpath(prt, chd) {
    if( !prt || !chd)
        return false;

    return chd.indexOf(prt) == 0;
}

function getSelXpath(node1, node2) {
    var xp1 = getXpathInfo(node1);
    var xp2 = getXpathInfo(node2);

    if (isParentXpath(xp1, xp2))
        return xp1;
    if (isParentXpath(xp2, xp1))
        return xp2;

    var p = node1.parentElement;
    while (p && p.tagName != "BODY" && p.tagName != "body") {
        var xp = getXpathInfo(p);
        if (isParentXpath(xp, xp2)) 
            return xp;
        else
            p = p.parentElement;
    }

    return false;
}

function turn_dict_to_array(d) {
    var t = [];
    for (var k in this.mark_dict) {
        t.push({"key": k, "val": this.mark_dict[k]});
    }
    return t;
}

function clone_dict(obj){
    var ret = {}, k;
    var ret, k, b;
    if((b = (obj instanceof Array))|| obj instanceof Object){
        ret = b?[]: {};
        for(k in obj){
            if(obj[k] instanceof Array || obj[k] instanceof Object){ret[k] = clone_dict(obj[k]);}else{
                ret[k] = obj[k];
            }

        }
    }

    return ret;
}

//获取控件绝对位置
function getAbsolutePos(pElementId) {
    o = document.getElementById(pElementId);
    oLeft = o.offsetLeft;            
    oTop = o.offsetTop;
    while(o.offsetParent!=null) { 
        oParent = o.offsetParent;    
        oLeft += oParent.offsetLeft; 
        oTop += oParent.offsetTop ; // 加父层级顶部位置
        o = oParent;
    }
    return {x:oLeft, y:oTop};
}

function genUniqAttrVal() {
    return Date.parse(new Date()) + Math.random();
}

