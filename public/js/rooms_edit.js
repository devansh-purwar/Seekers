a = document.querySelectorAll("select#neighbourhood > option");
for(var i=0;i<a.length;i++){
    if(a[i].attributes.value.value===room.neighbourhood){
        a[i].selected = true;
        break;
    }
}

b = document.querySelectorAll("select#city > option");
for(var i=0;i<b.length;i++){
    if(b[i].attributes.value.value===room.city){
        b[i].selected = true;
        break;
    }
}

c = document.querySelectorAll("select#stay > option");
for(var i=0;i<c.length;i++){
    if(c[i].attributes.value.value===room.minStay){
        c[i].selected = true;
        break;
    }
}

d = document.querySelectorAll("select#bed > option");
for(var i=0;i<d.length;i++){
    if(d[i].attributes.value.value===room.bed){
        d[i].selected = true;
        break;
    }
}
e = document.querySelectorAll("select#male > option");
for(var i=0;i<e.length;i++){
    if(e[i].attributes.value.value===room.mateMale){
        e[i].selected = true;
        break;
    }
}

f = document.querySelectorAll("select#female > option");
for(var i=0;i<f.length;i++){
    if(f[i].attributes.value.value===room.mateFemale){
        f[i].selected = true;
        break;
    }
}

g = document.querySelectorAll("select#slogan > option");
for(var i=0;i<g.length;i++){
    if(g[i].attributes.value.value===room.slogan){
        g[i].selected = true;
        break;
    }
}

h = document.querySelectorAll("select#living-as > option");
for(var i=0;i<h.length;i++){
    if(h[i].attributes.value.value===room.livingAs){
        h[i].selected = true;
        break;
    }
}

k = document.querySelectorAll("select#status > option");
for(var i=0;i<k.length;i++){
    if(k[i].attributes.value.value===room.status){
        k[i].selected = true;
        break;
    }
}
j = document.querySelectorAll("select#gender > option");
for(var i=0;i<j.length;i++){
    if(j[i].attributes.value.value===room.gender){
        j[i].selected = true;
        break;
    }
}
m = document.querySelector("#ensuit-yes");
l = document.querySelector("#ensuit-no");
n = document.querySelector("#bills-yes");
o = document.querySelector("#bills-no");
if(l.attributes.value.value===room.ensuite){
    l.checked = true;
} else if (m.attributes.value.value===room.ensuite){
    m.checked = true;
}
if(n.attributes.value.value===room.ensuite){
    n.checked = true;
} else if (o.attributes.value.value===room.ensuite){
    o.checked = true;
}

