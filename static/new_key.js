function new_key(event) {
	var public_key = "abc";
	var private_key = "123";
	var keys = document.querySelector("div#keys");
	var key = document.createElement("div");
	key.className = "key";
	var remove_key = document.createElement("a");
	remove_key.className = "remove_key";
	remove_key.innerHTML = "x";
	key.appendChild(remove_key);
	var key_name = document.createElement("a");
	key_name.className = "key_name";
	key_name.innerHTML = public_key;
	key.appendChild(key_name);
	keys.appendChild(key);
	remove_key.addEventListener("click", function() {
		keys.removeChild(key);
	});
};
