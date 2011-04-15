var AutoComplete = new Class({
	Implements: [Options, Events],
	options: {
		words: [],
		startLength: 1,
		results: 5
	},
	initialize: function(target, options) {
		this.setOptions(options);
		
		this.input = $(target);
		this.input.addClass('ac-input');

		this.shadow = this.input.clone();
		this.shadow.set('class', 'ac-shadow');
		this.shadow.inject(this.input, 'before');
		
		this.input.setStyles({
			position: 'relative',
			'z-index': '5',
			background: 'none'
		});
		
		this.shadow.setStyles({
			position: 'absolute',
			'z-index': '1',
			color: 'grey',
			padding: this.input.getStyle('padding'),
			margin: this.input.getStyle('margin'),
			'border-width': this.input.getStyle('border-width')
		});

		this.suggestionList =  new Element('ul', {
			'class': 'ac-suggestions',
			styles: {
				position: 'absolute',
				display: 'none',
				'list-style': 'none outside none',
				padding: '0',
				margin: '0',
				border: '1px solid #CCC',
				'border-top': 'none'
			}
		});
		
		document.body.grab(this.suggestionList);

		this.suggestionList.addEvent('mousemove:relay(li.ac-suggestion)', function(event, target) {
			this.selectSuggestion(target);
		}.bind(this));
		
		this.suggestionList.addEvent('mousedown:relay(li.ac-suggestion)', function(event, target) {
			this.input.value = target.get('text');
			this.shadow.value = '';
			this.input.focus();
			this.suggestionList.setStyle('display', 'none');
		}.bind(this));
		
		this.input.addEvent('keypress', function(event) {
			if(event.key == 'tab' && this.shadow.value && this.shadow.value.length > this.input.value.length) {
				this.input.value = this.shadow.value;
				event.preventDefault();
			}
			else if(event.key == 'up') {
				if(this.suggestionList.get('display') == 'none') {
					return;
				}
				var selected = $$('li.ac-suggestion.selected');
				if(selected[0] && selected[0].getPrevious()) {
					this.selectSuggestion(selected[0].getPrevious());
				}
				else if(this.suggestionList.getLast('li.ac-suggestion')) {
					this.selectSuggestion(this.suggestionList.getLast('li.ac-suggestion'));
				}
			}
			else if(event.key == 'down') {
				if(this.suggestionList.get('display') == 'none') {
					return;
				}
				var selected = $$('li.ac-suggestion.selected');
				if(selected[0] && selected[0].getNext()) {
					this.selectSuggestion(selected[0].getNext());
				}
				else if(this.suggestionList.getFirst('li.ac-suggestion')) {
					this.selectSuggestion(this.suggestionList.getFirst('li.ac-suggestion'));
				}
			}
			else if(event.key == 'enter') {
				var selected = $$('li.ac-suggestion.selected');
				if(selected[0]) {
					this.input.value = selected[0].get('text');
					this.shadow.value = '';
					this.input.focus();
					this.suggestionList.setStyle('display', 'none');
				}
			}
		}.bind(this));

		this.input.addEvent('keyup', function(event) {
			if(event.key == 'up' || event.key == 'down' || event.key == 'enter') return;
			var first = this.showSuggestions(this.input.value);
			if(first) {
				this.shadow.value = first;
				this.shadow.value = this.input.value + this.shadow.value.slice(this.input.value.length, this.shadow.value.length);
			}
			else {
				this.shadow.value = '';
			}			
		}.bind(this));
		
		this.input.addEvent('blur', function(event) {
			this.suggestionList.setStyle('display', 'none');
		}.bind(this));
		
	},
	selectSuggestion: function(target) {
		this.suggestionList.getChildren('li.ac-suggestion').each( function(child) {
			$(child).removeClass('selected');
		});
		target.addClass('selected');
	},
	setSuggestions: function(suggestions) {
		this.options.words = suggestions;
	},
	showSuggestions: function(text) {
		if(text.length < this.options.startLength) {
			this.suggestionList.hide();
			return false;
		}
	
		var suggestions = (Array.filter(this.options.words, function(word) {
			return word.startsWith(text, 'i');
		})).slice(0, this.options.results);
		
		if(suggestions.length < 1) {
			this.suggestionList.hide();
			return false;
		}
		
		this.suggestionList.empty();
		
		suggestions.each(function(suggestion) {
			this.suggestionList.grab(
				new Element('li', {
					'class': 'ac-suggestion',
					text: suggestion,
					styles: {
						cursor: 'pointer'
					}
				})
			)
		}.bind(this));

		this.suggestionList.setStyles({
			width: this.input.getStyle('width'),
			top: this.input.getPosition().y + this.input.getSize().y,
			left: this.input.getPosition().x,
			'z-index': '1000',
			background: 'white',
			display: 'block'
		});

		// this.suggestionList.show();

		return suggestions[0];
	}
});

String.implement({
	startsWith: function(string, options) {
		string = string.escapeRegExp();
		return this.test('^'+string, options);
	}
});