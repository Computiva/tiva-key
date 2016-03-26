function updateKeys(event) {
	var keys = JSON.parse(localStorage.getItem("keys")) || new Object();
	var keys_div = document.querySelector("div#keys");
	keys_div.innerHTML = "";
	for (key in keys) {
		var key_div = document.createElement("div");
		key_div.className = "key";
		var remove_key = document.createElement("a");
		remove_key.className = "remove_key";
		remove_key.innerHTML = "<i class=\"fa fa-times fa-fw\"></i>";
		remove_key.key = key;
		key_div.appendChild(remove_key);
		var key_name = document.createElement("a");
		key_name.className = "key_name";
		key_name.innerHTML = key;
		key_name.innerHTML += "<i id=\"key_status\" class=\"fa fa-key fa-fw\"></i>";
		key_div.appendChild(key_name);
		keys_div.appendChild(key_div);
		remove_key.addEventListener("click", function(event) {
			if (event.target.key in keys) {
				delete keys[event.target.key];
			};
			if (event.target.parentElement.key in keys) {
				delete keys[event.target.parentElement.key];
			};
			localStorage.setItem("keys", JSON.stringify(keys));
			updateKeys();
		});
	};
};

function newKey(event) {
	var pki = forge.pki;
	var rsa = pki.rsa;
	var state = rsa.createKeyPairGenerationState();
	var progress = document.querySelector("p#progress");
	progress.innerHTML = "";
	var step = function() {
		if (!rsa.stepKeyPairGenerationState(state, 100)) {
			progress.innerHTML += ".";
			setTimeout(step, 1);
		} else {
			progress.innerHTML = "";
			var private_key_pem = pki.privateKeyToPem(state.keys.privateKey);
			var public_key_pem = pki.publicKeyToPem(state.keys.publicKey);
			var keys = JSON.parse(localStorage.getItem("keys")) || new Object();
			keys[public_key_pem.substr(72, 16)] = private_key_pem;
			localStorage.setItem("keys", JSON.stringify(keys));
			updateKeys();
		};
	};
	setTimeout(step);
};
