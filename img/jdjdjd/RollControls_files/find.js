(function() {
  function KeywordMatch(parent, child, before, match, after) {
    this.parent = parent;
    this.child = child;
    this.before = before;
    this.match = match;
    this.after = after;
  }

  function findKeywordFromNode(keyword, node) {
    var matches = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      var childNode = node.childNodes[i];
      if (childNode.nodeType == Node.TEXT_NODE) {
        var keywordPattern = new RegExp('^((.|\\n)*)(' + keyword.replace('.', '\\.') 
          + ')((.|\\n)*)$', 'm');
        if (childNode.nodeValue.match(keywordPattern)) {
          matches.push(new KeywordMatch(node, childNode, RegExp.$1, RegExp.$3, RegExp.$4));
        }
      }
      else {
        findKeywordFromNode(keyword, node.childNodes[i]);
      }
    }

    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      var name = document.createElement('a');
      name.id = keyword;
      name.name = keyword;
      var coloredMatch = document.createElement('span');
      coloredMatch.className = 'match';
      coloredMatch.appendChild(document.createTextNode(match.match));
      match.parent.insertBefore(document.createTextNode(match.before), match.child);
      match.parent.insertBefore(name, match.child);
      match.parent.insertBefore(coloredMatch, match.child);
      match.parent.insertBefore(document.createTextNode(match.after), match.child);
      match.parent.removeChild(match.child);
    }
  }

  function findKeyword() {
    var keywordField = document.createElement('input');
    keywordField.id = 'keyword';
    keywordField.onfocus = function() {
      setTimeout(function() {keywordField.select()}, 10);
    };
    var keyword = document.location.hash;
    if (keyword) {
      keyword = keyword.substring(1);
      keywordField.value = keyword;
      findKeywordFromNode(keyword, document.body);
    }

    var keywordButton = document.createElement('button');
    keywordButton.innerHTML = 'Search';
    keywordButton.onclick = function() {
      document.location.hash = document.getElementById('keyword').value;
      document.location.reload();
    };
    keywordField.onkeyup = function(evt) {
      if (evt.keyCode == 13) keywordButton.onclick();
    };

    var keywordBox = document.createElement('div');
    keywordBox.className = 'keyword-box';
    keywordBox.appendChild(keywordField);
    keywordBox.appendChild(keywordButton);
    document.body.appendChild(keywordBox);
  }

  if (window.addEventListener) {
    //window.addEventListener('DOMContentLoaded', findKeyword, false);
    window.addEventListener('load', findKeyword, false);
  }
  else if (window.attachEvent) {
    window.attachEvent('onload', findKeyword);
  }
})();
