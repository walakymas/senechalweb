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
    ]


skills = []
passions = []

function refreshdata(id) {
    $.get( "https://senechalweb.herokuapp.com/json?id="+id,function( data ) {
      $('.skill .ui-icon').hide()
      $('#traits .ui-icon-check').hide()
      $('#passions .ui-icon').hide()
      char = data.char
      $( "#cid" ).val(id)
      $( "#json" ).val(JSON.stringify(char, null, 2))

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
          +'<li><span class="gold">Healing Rate</span> <em> (STR+CON)/10=</em> <strong>'+Math.round((char['stats']['con']*1+char['stats']['siz']*1)/10)+' </strong></li>'
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
                  $(sgn=='Other'?'#skills':'#combat').append('<li id="skill_'+skillcount+'"><span class="gold">'+sn+'</span> '+sv+'<span class="ui-icon ui-icon-check"></span></li>');
                  skills[skillcount++]='skills.'+sgn+'.'+sn;
              }
          }
      }
      $('#passions').html('')
      if ('passions' in char) {
          count = 0;
          passions = []
          for (const [pn, pv] of Object.entries(char['passions'])) {
              $('#passions').append('<li id="passion_'+count+'"><span class="gold">'+pn+'</span> '+pv+'<span class="ui-icon ui-icon-check"></span></li>');
              passions[count++]='passions.'+pn;
          }
      }
      if ('traits' in char) {
       $('#traits').show();
         for (const [tn, tv] of Object.entries(char['traits'])) {
            $('#trait_'+tn+' div:nth-child(2)').text(tv)
            $('#trait_'+tn+' div:nth-child(6)').text(20-tv*1)
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
     $('.ui-icon-check').hide()
     $('#passions .ui-icon').hide()
     if ('marks' in data) {
         for (i in skills) {
            if (data['marks'].includes(skills[i].replace(/.*\./g, ""))) {
                console.log(skills[i])
                $('#skill_'+i+' .ui-icon').show()
            }
         }
         for (i in passions) {
            if (data['marks'].includes(passions[i].replace(/.*\./g, ""))) {
                console.log(passions[i])
                $('#passion_'+i+' .ui-icon').show()
            }
         }
         for (i in traits) {
            if (data['marks'].includes(traits[i][0])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' div.div-table-col:nth-child(1) .ui-icon').show()
            }
            if (data['marks'].includes(traits[i][1])) {
              $('#trait_'+traits[i][0].toLowerCase().substring(0,3)+' div.div-table-col:nth-child(7) .ui-icon:last-child').show()
            }
         }
     }
    });
}
  $( function() {
     $('.ui-icon-check').hide();
     $('#passions .ui-icon').hide();
     refreshdata(32);
     setInterval(function (){refreshdata(32)},60000)
  } );
