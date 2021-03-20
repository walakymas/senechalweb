traits = [
    [ 'Chaste', 'Lustful' ],
    [ 'Energetic', 'Lazy' ],
    [ 'Forgiving', 'Vengeful' ],
    [ 'Generous', 'Selfish' ],
    [ 'Honest', 'Deceitful' ],
    [ 'Just', 'Arbitrary' ],
    [ 'Merciful', 'Cruel' ],
    [ 'Modest', 'Proud' ],
    [ 'Prudent', 'Reckless' ],
    [ 'Spiritual', 'Worldly' ],
    [ 'Temperate', 'Indulgent' ],
    [ 'Trusting', 'Suspicious' ],
    [ 'Valorous', 'Cowardly' ],
    ];
var surl = 'https://senechalweb.herokuapp.com'
if (window.location.href.indexOf('localhost')>0) {
    surl = '..';
    cid = 63;
}
pcs = []

function addBlock (id, func, def) {
    kmap = new Map()
    for (i in pcs ) {
        for (const [tn, tv] of Object.entries(func(i))) {
            kmap.set(tn, tv)
        }
    }
    keys = []
    for (var k of kmap.keys()) {
        keys.push(k)
    }
    keys.sort()
    keys.forEach(function (k) {
        s=''
        for (i in pcs) {
            s+='<td>'
            s+=func(i)[k] ? func(i)[k] : def;
            s+='</td>'
        }
        console.log(s)
        $('#'+id).append('<tr added="'+id+'"><th>'+k+'</th>'+s+'</tr>')
    })

}


function redraw() {
    for (i in pcs ) {
        console.log(i+':'+pcs[i]['shortName'])
        $('#name').append('<th added="name">'+pcs[i]['shortName']+'</th>')
        $('#siz').append('<td added="siz">'+pcs[i]['stats']['siz']+'</td>')
        $('#dex').append('<td added="dex">'+pcs[i]['stats']['dex']+'</td>')
        $('#con').append('<td added="con">'+pcs[i]['stats']['con']+'</td>')
        $('#str').append('<td added="str">'+pcs[i]['stats']['str']+'</td>')
        $('#app').append('<td added="app">'+pcs[i]['stats']['app']+'</td>')
    }
    for (t in traits) {

        tn = traits[t][0].substr(0,3).toLowerCase();
        s =  ''
        for (i in pcs ) {
            s+='<td>'+pcs[i]['traits'][tn]+' / '+(20-pcs[i]['traits'][tn]*1)+'</td>'
        }
        $('#traits').append('<tr added="trait_'+tn+'"><th>'+traits[t][0]+' / '+traits[t][1]+'</th>'+s+'</tr>')
    }
    addBlock('combat', function(i) { return pcs[i]['skills']['Combat']},'--')
    addBlock('weapons', function(i) { return pcs[i]['skills']['Weapons']},'--')
    addBlock('other', function(i) { return pcs[i]['skills']['Other']},'--')
    addBlock('passions', function(i) { return pcs[i]['passions']},'--')
}

  $( function() {
      $.get( surl+"/players",function( list ) {
        pcs = list
        redraw()
      });
  });
