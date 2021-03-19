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

horsetypes = {
    'charger': {'arm': 5, 'siz': 34, 'con':12 , 'dex':17, 'str':30, 'dam':'6d6', mov:8},
    'rouncy': {'arm': 4, 'siz': 26, 'con':14 , 'dex':10, 'str':18, 'dam':'4d6', mov:6},
    'sumpter': {'arm': 3, 'siz': 22, 'con':16 , 'dex':12, 'str':15, 'dam':'3d6', mov:5},
    'stumper': {'arm': 3, 'siz': 22, 'con':16 , 'dex':12, 'str':15, 'dam':'3d6', mov:5},
    'courser': {'arm': 5, 'siz': 30, 'con':15 , 'dex':25, 'str':24, 'dam':'4d6', mov:9},
    'palfrey': {'arm': 3, 'siz': 26, 'con':8 , 'dex':10, 'str':16, 'dam':'3d6', mov:6}
}

skills = []
passions = []
cid = 32;
var searchParams = new URLSearchParams(window.location.search);
char = {}
data = {}
event = {}

const options = {
mode: 'code',
modes: ['code', 'form', 'text', 'tree', 'view', 'preview']
}
editor = {}

var surl = 'https://senechalweb.herokuapp.com'
if (window.location.href.indexOf('localhost')>0) {
    surl = '..';
    cid = 63;
}
if (localStorage.getItem('cid')) {
    cid = localStorage.getItem('cid')
}

if (searchParams.has('cid')) {
    cid=searchParams.get('cid')
}

function eventdialog(id) {
    if ('memberId' in char ) {
        event =  {'year': 0, 'description': '', 'glory': 0, 'id': -1}
        if ('events' in data) {
            for (eid in data['events']) {
                if (data['events'][eid]['id'] == id) {
                    event = data['events'][eid];
                }
            }
        }
        $('#eventid').html(id>0?id:'--')
        $('#eventyear').val(event['year'])
        $('#eventglory').val(event['glory'])
        $('#eventdescription').html(event['description'])
        $("#eventdialog" ).dialog('open');
    }
}

function mark(name) {
    $( "#markdialog" ).dialog({
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Bejelölöm": function() {
          $( this ).dialog( "close" );
          $.post( surl+"/mark", {'id':char['memberId'], 'mark':name},function( data ) {
            redraw(data)
            console.log('marked')
          });
        },
        Mégsem: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    $( "#markdialog" ).dialog('open');
}

function redrawMain() {
    $('#name').text(char['name'])
    if  ('url' in char) {
        $('#charimg').attr('src',char['url'])
        $('#charimg').show()
    } else {
        $('#charimg').hide()
    }

    $('#main').html('')
    if ('main' in char) {
        for (const [n, v] of Object.entries(char['main'])) {
            if (n != 'Glory') {
                $('#main').append('<li><span class="gold">'+n+'</span> '+v+'</li>');
            }
        }
    }
      $('#description').html('')
      if ('description' in char) {
        $('#description').html(char['description'].replace(/\n/g, "<br/>"))
      }
      $('#longdescription').html('')
      if ('longdescription' in char) {
        $('#longdescription').html(char['longdescription'].replace(/\n/g, "<br/>"))
      }
}

function redrawStat() {
      $('#hp').html('?');
      if ('stats' in char) {
          $('#statistics').html(
          '<li><span class="gold">SIZ</span> '+char['stats']['siz']+'</li>'
          +'<li><span class="gold">DEX</span> '+char['stats']['dex']+'</li>'
          +'<li><span class="gold">STR</span> '+char['stats']['str']+'</li>'
          +'<li><span class="gold">CON</span> '+char['stats']['con']+'</li>'
          +'<li><span class="gold">APP</span> '+char['stats']['app']+'</li>'
          +'<li><span class="gold">Damage</span> <em> (STR+SIZ)/6=</em> <strong>'+Math.round((char['stats']['str']*1+char['stats']['siz']*1)/6)+'d6 </strong></li>'
          +'<li><span class="gold">Healing Rate</span> <em> (STR+CON)/10=</em> <strong>'+Math.round((char['stats']['con']*1+char['stats']['str']*1)/10)+' </strong></li>'
          +'<li><span class="gold">Move Rate</span> <em> (STR+DEX)/10=</em> <strong>'+Math.round((char['stats']['dex']*1+char['stats']['siz']*1)/10)+' </strong></li>'
          +'<li><span class="gold">Total Hitpoints</span> <em> (SIZ+CON)=</em> <strong>'+Math.round((char['stats']['siz']*1+char['stats']['con']*1))+' </strong></li>'
          +'<li><span class="gold">Unconscious</span> <em> (HP/4)=</em> <strong>'+Math.round((char['stats']['con']*1+char['stats']['siz']*1))+' </strong></li>'
          +'<li><span class="gold">Major Wound</span> <em> (CON)=</em> <strong>'+char['stats']['con']+' </strong></li>'
          +'<li><span class="gold">Knockdown</span> <em> (SIZ)=</em> <strong>'+char['stats']['siz']+' </strong></li>'
          );
          $('#hp').html(Math.round((char['stats']['siz']*1+char['stats']['con']*1)))
      }


}

function redrawEvents() {
      $('#events').html('');
      $('#glory').html('?');
      year = -1;
      if ('events' in data) {
          glory = 0;
          s = ''
          for (eid in data['events']) {
            event = data['events'][eid];
            glory+=event['glory'];

            if (year != event['year']) {
                year = event['year'];
                $('#events').append('<h3>'+event['year']+'</h3> <div id="year_'+year+'"></div>');
            }
            $('#year_'+year).append('<div id="event_'+event['id']+'" class="event">'+(event['glory']>0?'<span class="gold">'+event['glory']+'</span> ':'')+'<span>'+event['description'].replace(/\n/g, "<br/>")+'</span></div>')
          }
          $('#events').accordion('refresh');
          $('#glory').html(glory);
      }

      $('div.event').click(function() {
        eventdialog($(this).attr('id').substr(6));
      })
}

function redrawSkill() {
      $('#combat').html('')
      $('#skills').html('')
      if ('skills' in char) {
          skillcount = 0;
          skills = []
          for (const [sgn, sgv] of Object.entries(char['skills'])) {
              for (const [sn, sv] of Object.entries(sgv)) {
                  $(sgn=='Other'?'#skills':'#combat').append('<li id="skill_'+skillcount+'"><span class="ui-icon ui-icon-radio-off" mark="'+sn+'"></span><span class="gold">'+sn+'</span> '+sv+'</li>');
                  skills[skillcount++]='skills.'+sgn+'.'+sn;
              }
          }
      }
}

function redrawPassion() {
      $('#passions').html('')
      if ('passions' in char) {
          count = 0;
          passions = []
          for (const [pn, pv] of Object.entries(char['passions'])) {
              $('#passions').append('<li id="passion_'+count+'"><span class="ui-icon ui-icon-radio-off" mark="'+pn+'"></span><span class="gold">'+pn+'</span> '+pv+'</li>');
              passions[count++]='passions.'+pn;
          }
      }
}

function redrawTrait() {
      if ('traits' in char) {
       $('#traits').show();
         for (const [tn, tv] of Object.entries(char['traits'])) {
            $('#trait_'+tn+' tr:first-child  td:nth-child(2)').text(tv)
            $('#trait_'+tn+' tr:first-child  td:nth-child(5)').text(20-tv*1)
            $('#trait_'+tn+' .ratioGreen').css('width', (5*tv)+"%")
            $('#trait_'+tn+' .ratioRed').css('width', 5*(20-tv)+"%")
         }
      } else {
       $('#traits').hide();
      }
}

function redrawNpc(npc) {
    id = npc['char']['dbid']
    if (npc['char']['description']) {
        console.log(npc['char']['description'])
        $('#npc_'+npc['char']['dbid']).append('<p>'+npc['char']['description']+'</p>')
    }
    if (npc['char']['url']) {
        $('#npc_'+npc['char']['dbid']).append('<img width="100%" src="'+npc['char']['url']+'"/>')
    }
    table = $('#npct_'+id)
    if (npc['char']['main']) {
        for (const [n, v] of Object.entries(npc['char']['main'])) {
            table.append('<tr><th>'+n+'</th><td>'+v+'</td></tr>');
        }
    }
    if (npc['char']['stats']) {
        for (const [n, v] of Object.entries(npc['char']['stats'])) {
            table.append('<tr><th>'+n+'</th><td>'+v+'</td></tr>');
        }
    }
    if (npc['char']['skills']) {
        for (const [n, v] of Object.entries(npc['char']['skills'])) {
            for (const [n2, v2] of Object.entries(v)) {
                table.append('<tr><th>'+n2+'</th><td>'+v2+'</td></tr>');
            }
        }
    }
    if (npc['char']['passions']) {
        for (const [n, v] of Object.entries(npc['char']['passions'])) {
            table.append('<tr><th>'+n+'</th><td>'+v+'</td></tr>');
        }
    }
}

function npc(npc) {
    s='<h5>'+npc['name']+' <i>('+npc['connection']+')</h5>';
    if ('dbid' in npc) {
        s+='<div id="npc_'+npc['dbid']+'"></div>'
        $.get( surl + "/npc?id="+npc['dbid'],function( data ) {
          redrawNpc(data)
        });
    }
    s+='<table class="stats" '+(npc['dbid']?(' id="npct_'+npc['dbid']+'"'):"")+'>'
    if ('show' in npc) {
        if (npc['show']['born'] && npc['connection'].toLowerCase()=='squire' ) {
            console.log(data['year']+':'+npc['show']['born'])
            npc['show']['Years']=data['year']*1-npc['show']['born']*1
        }
        for (const [n2, v2] of Object.entries(npc['show'])) {
            s += '<tr><th>'+n2+'</th><td>'+v2+'</td></tr>';
        }
    }
    s+='</table>'
    return s
}


function redrawAccordion() {
      $('#army').html('')
      if ('army' in char) {
          for (const [n, v] of Object.entries(char['army'])) {
             $('#army').append('<tr><th>'+n+'</th><td>'+v+'</td></tr>');
          }
      }
      $('#accordion .npcs').remove()
      if ('npcs' in char) {
          for (const [n, v] of Object.entries(char['npcs'])) {
             $('#accordion').append('<h3 class="npcs">'+n+'</h3><div class="npcs">'+npc(v)+'</div>');
          }
      }


     horses = ['charger', 'rouncy', 'rouncy', 'sumpter', 'sumpter'];
     if ('winter' in char && 'horses' in char['winter']) {
        horses = char['winter']['horses'];
     }
     htype = horsetypes[horses[0]];
     $('#htyp').html(horses[0]);
     $('#harm').html(htype['arm'])
     $('#hsiz').html(htype['siz'])
     $('#hdex').html(htype['dex'])
     $('#hstr').html(htype['str'])
     $('#hcon').html(htype['con'])

     $('#hdam').html(htype['dam'])
     $('#hhea').html(Math.round((htype['con']*1+htype['str']*1)/10))
     $('#hmov').html(htype['mov'])
     $('#hhp').html(Math.round((htype['siz']*1+htype['con']*1)))
     $('#hunc').html(Math.round((htype['con']*1+htype['siz']*1)/4))
     $('#hother').html('');
     for(i in horses) {
        if (i>0) {
            mov = '???'
            if (horses[i] in horsetypes) {
                htype = horsetypes[horses[i]]
                mov = htype['mov']
            }
            $('#hother').append('<tr><th>Type</th><td>'+horses[i]+'</td><th>Move</th><td>'+mov+'</td></tr>')
        }
     }
     $('#accordion').accordion("refresh")
}

function redraw(newdata) {
    if (data['modified']  != newdata['modified']) {
        data = newdata;
        char = newdata['char'];
        redrawMain();
        redrawStat();
        redrawSkill();
        redrawPassion();
        redrawTrait();
        redrawAccordion();
        $('[mark]').on('click',function() {
            mark($(this).attr('mark'));
        });
    }
    data = newdata;
    redrawEvents();

     $('.ui-icon-bullet').removeClass('ui-icon-bullet').addClass('ui-icon-radio-off')
     if ('marks' in data) {
         for (i in skills) {
            if (data['marks'].includes(skills[i].replace(/.*\./g, ""))) {
                $('#skill_'+i+' .ui-icon').removeClass('ui-icon-radio-off').addClass('ui-icon-bullet')
            }
         }
         for (i in passions) {
            if (data['marks'].includes(passions[i].replace(/.*\./g, ""))) {
                 $('#passion_'+i+' .ui-icon').removeClass('ui-icon-radio-off').addClass('ui-icon-bullet')
            }
         }
         for (i in traits) {
            if (data['marks'].includes(traits[i][0])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' .left').removeClass('ui-icon-radio-off').addClass('ui-icon-bullet')
            }
            if (data['marks'].includes(traits[i][1])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' .right').removeClass('ui-icon-radio-off').addClass('ui-icon-bullet')
            }
         }
     }
}
function refreshdata(id) {
    cid = id;
    localStorage.setItem('cid', id)
    $('#pdf').attr('href', surl + '/pdf?id='+id)
    $.get( surl + "/json?id="+id,function( data ) {
      redraw(data)
    });
}

  $( function() {
    const container = document.getElementById('jsoneditor')
    editor = new JSONEditor(container, options)
    $('#accordion').accordion();
    $('#events').accordion();

     $('.ui-icon-bullet').hide();
     $('#passions .ui-icon').hide();
     refreshdata(cid);
     setInterval(function (){refreshdata(cid)},60000)
     $( "#markdialog" ).dialog({autoOpen: false});
     $( "#selectdialog" ).dialog({
      autoOpen: false,
      dialogClass: 'ui-widget-shadow',
      height: "auto",
      width: 800,
      modal: true,
      buttons: {
        "Mutasd": function() {

        }
      }
     });
     $('#name').click(function () {
        $.get( surl+"/json",function( list ) {
            $( "#selectdialog" ).dialog('open')
            $('#selectchar').autocomplete({
              source: Object.keys(list),
              select: function( event, ui ) {
                $( "#selectdialog" ).dialog('close')
                refreshdata(list[ui.item.value]);
              }
            });
        });
     })

     $( "#eventdialog" ).dialog({
      autoOpen: false,
      dialogClass: 'ui-widget-shadow',
      height: "auto",
      width: 800,
      modal: true,
      buttons: {
        "Rögzítem": function() {
          $( this ).dialog( "close" );
          $.post( surl+"/event", {
            'eid':event['id']
            , 'glory':$('#eventglory').val()
            , 'year':$('#eventyear').val()
            , 'description':$('#eventdescription').val()
            , 'mid':char['memberId']
            },function( data ) {
            redraw(data)
            console.log('marked')
          });
        },
        "Törlöm": function() {
          $( this ).dialog( "close" );
          $.post( surl+"/event", {'eid':event['id'], 'glory':-1, 'mid':char['memberId']},function( data ) {
            redraw(data)
            console.log('marked')
          });
        },
        "Mégsem": function() {
          $( this ).dialog( "close" );
        }
      }
    });

     jsondialog = $( "#jsondialog" ).dialog({
        autoOpen: false,
        dialogClass: 'ui-widget-shadow',
        height: 800,
        width: 800,
        modal: true,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
      buttons: {
        "Modify": function() {
          jsondialog.dialog( "close" );
          $.post( surl+"/modify", {'id':cid, 'json':JSON.stringify(editor.get())},function( data ) {
            console.log('modified')
            redraw(data)
          });
        }
      },
    });
    $('#eventshead').click(function(){
        console.log('eventshead')
        eventdialog(-1);
    })

    $( "#stathead" ).on( "click", function() {
      $( "#json" ).val(JSON.stringify(char, null, 2))
      editor.set(char)
      $( "#jsondialog" ).dialog( "open" );
    });
    $('.traitcheck').on('click', function() {
        tid = $(this).parent().parent().parent().attr('id').substring(6,9);
        console.log($(this).hasClass('left')+":"+tid);
        for (i in traits) {
           if (traits[i][0].toLowerCase().substring(0,3) == tid ) {
              mark(traits[i][$(this).hasClass('left')?0:1])
           }
        }
     });
  });
