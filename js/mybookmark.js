  // 因為被包在二層iframe內，所以要一直呼叫外層的母視窗close()
  function closeWindow(w) {
      try {
          w.close();
      } catch (e) {}
      closeWindow(w.parent);
  }

  function onFinished(data) {
      console.log(data);

      // https://getbootstrap.com/docs/4.0/components/alerts/
      if (data.info === 'OK') {
          $('#flashMessage').html('<div class="alert alert-success" role="alert">' + data.info + '</div>');
          setTimeout(function() {
              $('#flashMessage').html(''); // clear message after 3000ms
              //window.close(); // not work: 因為被包在二層iframe內，無法呼叫外面二層的母視窗close()
              closeWindow(window);
          }, 1000);
      } else {
          $('#flashMessage').html('<div class="alert alert-danger" role="alert">' + data.info + '</div>');
      }
  }

  function beautifyTag() {
      var tag = $('#tag').val().trim();
      // beautify tag
      tag = tag.replace(/\s+/g, ' ').replace(/^\s*,/g, '').replace(/,\s*,/g, ',').replace(/,\s*$/g, '').replace(/\s,/g, ',').replace(/,(\S)/g, ', $1');
      $('#tag').val(tag);
  }

  function onSave() {
      // beautify tag
      beautifyTag();

      var title = $('#title').val().trim();
      var url = $('#url').val().trim();
      var tag = $('#tag').val().trim();
      var note = $('#note').val().trim();

      console.log(title, url, tag, note);

      $('#flashMessage').html('<div class="alert alert-info" role="alert">Saving Bookmark...</div>');

      // call addBookmark() in web-app.gs to pass data
      // https://developers.google.com/apps-script/guides/html/reference/run
      google.script.run.withSuccessHandler(onFinished)
          .addBookmark(title, url, tag, note);
  }

  // for autocomplete
  function split(val) {
      return val.split(/,\s*/)
  }
  // for autocomplete
  function extractLast(term) {
      return split(term).pop()
  }

  function tagAutoComplete() {
      $('#tag')
          .on('keydown', function(event) {
              if (event.keyCode === $.ui.keyCode.TAB &&
                  $(this).autocomplete('instance').menu.active) {
                  event.preventDefault()
              }
          })
          .autocomplete({
              minLength: 0,
              source: function(request, response) {
                  // delegate back to autocomplete, but extract the last term
                  response($.ui.autocomplete.filter(
                      tagCloud, extractLast(request.term)))
              },
              focus: function() {
                  // prevent value inserted on focus
                  return false
              },
              select: function(event, ui) {
                  var terms = split(this.value)
                  // remove the current input
                  terms.pop()
                  // add the selected item
                  terms.push(ui.item.value)
                  // add placeholder to get the comma-and-space at the end
                  terms.push('')
                  this.value = terms.join(', ')
                  beautifyTag();
                  return false
              }
          });
  }

  function main() {
      $('#ok').on('click', onSave);

      // init form
      if (urlParams.title !== '') {
          $('#title').val(urlParams.title)
      }

      if (urlParams.url !== '') {
          $('#url').val(urlParams.url)
      }

      if (urlParams.note !== '') {
          $('#note').val(urlParams.note)
      }

      tagAutoComplete();

      $('#tag').blur(beautifyTag);
  }
