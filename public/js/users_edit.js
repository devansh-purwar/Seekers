a = document.querySelectorAll("select#city > option");
for(var i=0;i<a.length;i++){
    if(a[i].attributes.value.value===userProfile.city){
        a[i].selected = true;
        break;
    }
}

m = document.querySelector("#profile-status-visible");
l = document.querySelector("#profile-status-hidden");

if(l.attributes.value.value===userProfile.profilePrivacy){
    l.checked = true;
} else if (m.attributes.value.value===userProfile.profilePrivacy){
    m.checked = true;
}

n = document.querySelector("#status-student");
o = document.querySelector("#status-professional");


if(n.attributes.value.value===userProfile.status){
    n.checked = true;
} else if (o.attributes.value.value===userProfile.status){
    o.checked = true;
}

x = document.querySelector("#gender-male");
y = document.querySelector("#gender-female");
z = document.querySelector("#gender-other");

if(x.attributes.value.value===userProfile.gender){
    x.checked = true;
} else if (y.attributes.value.value===userProfile.gender){
    y.checked = true;
} else if (z.attributes.value.value===userProfile.gender){
    z.checked = true;
}

u = document.querySelector("#living-as-single");
v = document.querySelector("#living-as-couple");

if(u.attributes.value.value===userProfile.livingAs){
    u.checked = true;
} else if (v.attributes.value.value===userProfile.livingAs){
    v.checked = true;
}

b = document.querySelector("#team-up-yes");
c = document.querySelector("#team-up-no");

if(b.attributes.value.value===userProfile.lookingTeamUP){
    b.checked = true;
} else if (c.attributes.value.value===userProfile.lookingTeamUP){
    c.checked = true;
}

d = document.querySelector("#looking-for-room-yes");
e = document.querySelector("#looking-for-room-no");

if(d.attributes.value.value===userProfile.lookingForRooms){
    d.checked = true;
} else if (e.attributes.value.value===userProfile.lookingForRooms){
    e.checked = true;
}