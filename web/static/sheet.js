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
char = {}

var surl = 'https://senechalweb.herokuapp.com'
if (window.location.href.indexOf('localhost')>0) {
    surl = '..';
    cid = 63;
}

function redraw(data) {
      char = data.char

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
            $('#main').append('<li><span class="gold">'+n+'</span> '+v+'</li>');
          }
      }
      $('#left').html('')
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
          );
          $('#hp').html(Math.round((char['stats']['siz']*1+char['stats']['con']*1)))
      }
      $('#events').html('');
      $('#glory').html('');
      if ('events' in data) {
          glory = 0;
          for (eid in data['events']) {

            event = data['events'][eid];
            glory+=event['glory'];
            $('#events').append('<tr><td>'+event['year']+'</td><td>'+event['glory']+'</td><td>'+event['description'].replace(/\n/g, "<br/>")+'</td></tr>')
          }
          $('#glory').html(glory);
      }
      $('#combat').html('')
      $('#skills').html('')
      if ('skills' in char) {
          skillcount = 0;
          skills = []
          for (const [sgn, sgv] of Object.entries(char['skills'])) {
              for (const [sn, sv] of Object.entries(sgv)) {
                  $(sgn=='Other'?'#skills':'#combat').append('<li id="skill_'+skillcount+'"><span class="gold">'+sn+'</span> '+sv+'<span class="ui-icon ui-icon-radio-off" mark="'+sn+'"></span></li>');
                  skills[skillcount++]='skills.'+sgn+'.'+sn;
              }
          }
      }
      $('#passions').html('')
      if ('passions' in char) {
          count = 0;
          passions = []
          for (const [pn, pv] of Object.entries(char['passions'])) {
              $('#passions').append('<li id="passion_'+count+'"><span class="gold">'+pn+'</span> '+pv+'<span class="ui-icon ui-icon-radio-off" mark="'+pn+'"></span></li>');
              passions[count++]='passions.'+pn;
          }
      }

      $('[mark]').on('click',function() {
              $.post( surl+"/mark", {'id':char['memberId'], 'mark':$(this).attr('mark')},function( data ) {
                redraw(data)
                console.log('marked')
              });
      });

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
      $('#description').html('')
      if ('description' in char) {
        $('#description').html(char['description'].replace(/\n/g, "<br/>"))
      }
      $('#longdescription').html('')
      if ('longdescription' in char) {
        $('#longdescription').html(char['longdescription'].replace(/\n/g, "<br/>"))
      }
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
     $('#hunc').html(Math.round((htype['con']*1+htype['siz']*1)))
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
     console.log(char['winter']['horses'])
}

function refreshdata(id) {
    cid = id;
    $.get( surl+"/json?id="+id,function( data ) {
      redraw(data)
    });
}
  $( function() {
     $('.ui-icon-bullet').hide();
     $('#passions .ui-icon').hide();
     refreshdata(cid);
     setInterval(function (){refreshdata(cid)},60000)
     jsondialog = $( "#jsondialog" ).dialog({
        autoOpen: false,
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
          $.post( surl+"/modify", {'id':cid, 'json':$( "#json" ).val()},function( data ) {
            console.log('modified')
          });
        }
      },
    });
    $( "#charimg" ).on( "click", function() {
      $( "#json" ).val(JSON.stringify(char, null, 2))
      $( "#jsondialog" ).dialog( "open" );
    });
    $('.traitcheck').on('click', function() {
        tid = $(this).parent().parent().parent().attr('id').substring(6,9);
        console.log($(this).hasClass('left')+":"+tid);
        for (i in traits) {
           if (traits[i][0].toLowerCase().substring(0,3) == tid ) {
              $.post( surl+"/mark", {'id':char['memberId'], 'mark':traits[i][$(this).hasClass('left')?0:1]},function( data ) {
                redraw(data)
                console.log('marked')
              });
           }
        }

     });
  });
