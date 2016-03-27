var pki = forge.pki;
var rsa = pki.rsa;

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
		key_name.innerHTML += "<i class=\"fa fa-key fa-fw key_status\"></i>";
		var get_key = new XMLHttpRequest();
		get_key.key = key;
		get_key.key_status = key_name.querySelector("i.key_status");
		get_key.addEventListener("load", function() {
			var private_key_pem = keys[this.key];
			var private_key = pki.privateKeyFromPem(private_key_pem);
			var public_key = rsa.setPublicKey(n=private_key.n, e=private_key.n);
			var public_key_pem = pki.publicKeyToPem(public_key);
			if (public_key_pem == this.response) {
				this.key_status.classList.add("online");
				this.key_status.classList.remove("offline");
			} else {
				this.key_status.classList.add("offline");
				this.key_status.classList.remove("online");
				var register_key = new XMLHttpRequest();
				register_key.addEventListener("load", function() {
					updateKeys();
				});
				register_key.open("POST", "/key/register");
				register_key.send("name=" + encodeURIComponent(key) + "&key=" + encodeURIComponent(public_key_pem));
			};
		});
		get_key.open("GET", "/key/get?name=" + encodeURIComponent(key));
		get_key.send();
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
			keys[public_key_pem.substr(72, 16).replace(/[^a-zA-Z0-9]/g, "")] = private_key_pem;
			localStorage.setItem("keys", JSON.stringify(keys));
			updateKeys();
		};
	};
	setTimeout(step);
};
