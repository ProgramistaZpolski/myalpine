"use strict";

let dataLayer = {
	"dom": []
};

function myAlpine() {
	function capitalizeFirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	function $(context, selector, callback) {
		let result = context.querySelectorAll(`[data-pzpl-${selector}]`);
		if (!result.length > 0) {
			result = [context];
		};
		return result.forEach(el => callback(el));
	};

	function func(el, data) {
		const original = el;
		do {
			el = el.parentElement;
			if (!el) {
				el = original;
				break;
			};
		} while (!el.hasAttribute("data-pzpl-dom"));
		return data ? dataLayer.dom[el.dataset.pzplDom].func = data : dataLayer.dom[el.dataset.pzplDom].func();
	};

	function text(el) {
		if (!el.dataset.pzplText) {
			return;
		};
		if (el.dataset.pzplText.includes(" ")) {
			func(el, new Function(`return ${el.dataset.pzplText}`));
		} else {
			func(el, new Function(`return this.${el.dataset.pzplText}`));
		};
		el.innerText = func(el);
	};

	function html(el) {
		if (!el.dataset.pzplHtml) {
			return;
		};
		if (el.dataset.pzplHtml.includes(" ")) {
			func(el, new Function(`return ${el.dataset.pzplHtml}`));
		} else {
			func(el, new Function(`return this.${el.dataset.pzplHtml}`));
		};
		el.innerHTML = func(el);
	};

	function show(el) {
		if (!el.dataset.pzplShow) {
			return;
		};
		func(el, new Function(`return ${el.dataset.pzplShow}`));
		func(el) ? el.style.display = "block" : el.style.display = "none";
	};

	function bind(el) {
		if (!el.dataset.pzplBind) {
			return;
		};
		const dataSplit = el.dataset.pzplBind.split(",");
		func(el, new Function(`return ${dataSplit[1]}`));
		if (func(el)) {
			el.setAttribute(dataSplit[0], "true");
		} else {
			if (el.hasAttribute(dataSplit[0])) {
				el.removeAttribute(dataSplit[0]);
			};
		};
	};

	function model(el, parentEl) {
		if (!el.dataset.pzplModel) {
			return;
		};
		func(el, new Function(`this.${el.dataset.pzplModel} = "${el.value}";`))
		func(el);
		el.setAttribute("data-pzpl-keyup", true);
		addEvent(el, "keyup", parentEl);
		$(parentEl, "text", el => text(el));
	};

	function events(parentEl) {
		["click", "keyup", "change"].forEach(key => {
			$(parentEl, key, el => {
				addEvent(el, key, parentEl);
			});
		});
	};

	function addEvent(el, key, parentEl) {
		if (!el.hasAttribute(`data-pzpl-${key}`)) {
			return;
		};
		if (!el.hasAttribute(`data-pzpl-on${key}-handled`)) {
			el.addEventListener(key, () => {
				if (!el.dataset[`pzpl${capitalizeFirst(key)}`].includes(" ")) {
					func(el, new Function(`this.${el.dataset[`pzpl${capitalizeFirst(key)}`]}`));
				} else {
					func(el, new Function(`${el.dataset[`pzpl${capitalizeFirst(key)}`]}`));
				};
				func(el);

				doEverything(parentEl);
			});
		};
		el.setAttribute(`data-pzpl-on${key}-handled`, "true");
	};

	function htmlclass(el) {
		if (!el.dataset.pzplClass) {
			return;
		};
		func(el, new Function(`return ${el.dataset.pzplClass};`));
		el.setAttribute("class", func(el));
	};

	function cloak(el) {
		if (!el.hasAttribute("data-pzpl-cloak")) {
			return;
		};
		el.removeAttribute("data-pzpl-cloak");
	}

	function doEverything(parentEl) {
		$(parentEl, "show", el => show(el));
		$(parentEl, "text", el => text(el));
		$(parentEl, "html", el => html(el));
		$(parentEl, "bind", el => bind(el));
		$(parentEl, "class", el => htmlclass(el));
		$(parentEl, "model", el => model(el, parentEl));
		events(parentEl);
		$(parentEl, "cloak", el => cloak(el));
	};


	$(document, "data", parentEl => {
		const result = new Function(`return ${parentEl.dataset.pzplData};`)();
		parentEl.setAttribute("data-pzpl-dom", dataLayer.dom.length);
		dataLayer.dom.push(result);

		$(parentEl, "init", el => { func(el, new Function(`${el.dataset.pzplInit}`)); func(el); el.removeAttribute("data-pzpl-init"); });

		doEverything(parentEl);
	});
};

myAlpine();