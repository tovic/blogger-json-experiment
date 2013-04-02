// Multi Feed Loader Script by Taufik Nurrohman
// URL: http://www.dte.web.id, https://plus.google.com/108949996304093815163/about

var multiFeed_defaults = {
	feedsUri: [
		{
			name: "Posting JQuery",
			url: "http://www.dte.web.id",
			tag: "JQuery"
		},
		{
			name: "Posting CSS",
			url: "http://www.dte.web.id",
			tag: "CSS"
		},
		{
			name: "Widget-Widget Blogger",
			url: "http://www.dte.web.id",
			tag: "Widget"
		}
	],
	numPost: 4,
	showThumbnail: true,
	showSummary: true,
	summaryLength: 80,
	titleLength: "auto",
	thumbSize: 72,
	containerId: "feed-list-container",
	listClass: "list-entries",
	readMore: {
		text: "More",
		endParam: "?max-results=20"
	},
	autoHeight: false,
	current: -1,
	onLoadFeed: function(i) {
		// console.log(this.feedsUri[i].name);
	},
	onLoadComplete: function() {
		// console.log('Fully Loaded!');
	}
};

for (var i in multiFeed_defaults) {
	multiFeed_defaults[i] = (typeof (multiFeed[i]) !== undefined && typeof (multiFeed[i]) !== 'undefined') ? multiFeed[i] : multiFeed_defaults[i];
}

function listEntries(json) {

	var entry = json.feed.entry,
		o = multiFeed_defaults,
		ct = document.getElementById(o.containerId),
		el = document.createElement('div'),
		skeleton = "<ul>",
		total = o.feedsUri.length,
		title, link, summ, img;

	o.current++;

	for (var i = 0; i < o.numPost; i++) {
		if (i == entry.length) break;

		title = (o.titleLength !== "auto") ? entry[i].title.$t.substring(0, o.titleLength) + (o.titleLength < entry[i].title.$t.length ? '&hellip;' : '') : entry[i].title.$t;
		summ = ("summary" in entry[i]) ? entry[i].summary.$t.replace(/<br ?\/?>/g, " ").replace(/<.*?>/g, "") : "";
		summ = (o.summaryLength < summ.length) ? summ.substring(0, o.summaryLength) + '&hellip;' : summ;
		img = ("media$thumbnail" in entry[i]) ? '<img src="' + entry[i].media$thumbnail.url.replace(/\/s72(\-c)?\//, "/s" + o.thumbSize + "-c/") + '" style="width:' + o.thumbSize + 'px;height:' + o.thumbSize + 'px;">' : '<span class="fake-img" style="width:' + o.thumbSize + 'px;height:' + o.thumbSize + 'px;"></span>';
		
		for (var j = 0, jen = entry[i].link.length; j < jen; j++) {
			link = (entry[i].link[j].rel == 'alternate') ? entry[i].link[j].href : '#';
		}

		skeleton += '<li><div class="inner"' + (!o.autoHeight ? ' style="height:' + o.thumbSize + 'px;overflow:hidden;"' : '') + '>';
		skeleton += (o.showThumbnail) ? img : '';
		skeleton += '<div class="title"><a href="' + link + '">' + title + '</a></div>';
		skeleton += '<div class="summary">';
		skeleton += '<span' + (!o.showSummary ? ' style="display:none;"' : '')  + '>';
		skeleton += (o.showSummary) ? summ : '';
		skeleton += '</span></div>';
		skeleton += '<span style="display:block;clear:both;"></span></div></li>';
	}
	skeleton += "</ul>";
	el.className = o.listClass;
	el.innerHTML = '<div class="main-title"><h4>' + o.feedsUri[o.current].name + '</h4></div>' + skeleton + '<div class="more-link"><a href="' + o.feedsUri[o.current].url.replace(/\/$/, "") + '/search/label/' + o.feedsUri[o.current].tag + o.readMore.endParam + '">' + o.readMore.text + '</a></div>';
	ct.appendChild(el);
	o.onLoadFeed(o.current);
	if ((o.current + 1) == total) o.onLoadComplete();
}

(function(o) {
	var head = document.getElementsByTagName('head')[0];
	for (var i = 0, len = o.feedsUri.length; i < len; i++) {
		var script = document.createElement('script');
			script.type = "text/javascript";
			script.src = o.feedsUri[i].url + '/feeds/posts/summary' + (o.feedsUri[i].tag ? '/-/' + o.feedsUri[i].tag : '') + '?alt=json-in-script&max-results=' + o.numPost + '&callback=listEntries';
		head.appendChild(script);
	}
})(multiFeed_defaults);