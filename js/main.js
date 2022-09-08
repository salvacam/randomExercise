document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {
  	nameLocalStorage: '_randomExercise',

  	doExercise: document.getElementById('doExercise'),
  	reset: document.getElementById('reset'),
		modalReset: document.getElementById('modalReset'),
		modalPause: document.getElementById('modalPause'),
		textExercise: document.getElementById('textExercise'),

  	exercises: [
  		"FLEXIONES",
  		"ABDOMINALES",
  		"SENTADILLAS",
  		"TRIPCES",
  		"ZANCADAS",
  		"BURPEES",
  		"PESO MUERTO",
  		"BICEPS",
  		"GOMA",
  		"SERIE PUÑOS",
  		"RUEDA"
  	],
  
  	init: function() {

    	app.reset.addEventListener('click', app.resetExercises);
    	app.doExercise.addEventListener('click', app.calculateDoExercise);    	

	    if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
    	}
  	},

	resetExercises: function() {
			app.modalReset.classList.remove('hide');

			let okReset = document.getElementById("okReset");
			let closeReset = document.getElementById("closeReset");

			let okResetFunction = () => {
				app.modalReset.classList.add('hide');
			    okReset.removeEventListener("click", okResetFunction);
			    closeReset.removeEventListener("click", closeResetFunction);
			    localStorage.removeItem(app.nameLocalStorage);
			}

			closeResetFunction = () => {		
				app.modalReset.classList.add('hide');
			    okReset.removeEventListener("click", okResetFunction);
			    closeReset.removeEventListener("click", closeResetFunction);
			}

			okReset.addEventListener("click", okResetFunction);
			closeReset.addEventListener("click", closeResetFunction);		
	},

	calculateDoExercise: function() {

		let saveExercice = localStorage.getItem(app.nameLocalStorage);		
		let saveExerciceParseToday = null;
		let yourDate = new Date();

		if(saveExercice !== undefined && saveExercice !== null) {		
			let saveExerciceParse = JSON.parse(saveExercice);
			saveExerciceParseToday = saveExerciceParse.find(x => x.date === yourDate.toISOString().split('T')[0])
			if(saveExerciceParseToday !== undefined && saveExerciceParseToday !== null) {
				if (saveExerciceParseToday.exercises.length >= app.exercises.length) {					
					app.modalPause.classList.remove('hide');

					let closePause = document.getElementById("closePause");

					closePauseFunction = () => {
						app.modalPause.classList.add('hide');
				    closePauseFunction.removeEventListener("click", closePauseFunction);
					}

					closePause.addEventListener("click", closePauseFunction);

					return;
				}
			}
		}		

		let exerciseIndex = Math.floor(Math.random() * app.exercises.length);

		if(saveExercice === undefined || saveExercice === null) {			
			localStorage.setItem(app.nameLocalStorage, JSON.stringify([{'date': yourDate.toISOString().split('T')[0], 'exercises': [exerciseIndex] }]));
		} else {
			if(saveExerciceParseToday !== undefined && saveExerciceParseToday !== null) {
				if (saveExerciceParseToday.exercises.find(x => x === exerciseIndex))
				{					
					exerciseIndex = app.checkExercise(app.exercises.length, saveExerciceParseToday.exercises);
					saveExerciceParseToday.exercises.push(exerciseIndex);
					localStorage.setItem(app.nameLocalStorage, JSON.stringify([{'date': yourDate.toISOString().split('T')[0], 'exercises': saveExerciceParseToday.exercises }]));
				} else {
					saveExerciceParseToday.exercises.push(exerciseIndex);
					localStorage.setItem(app.nameLocalStorage, JSON.stringify([{'date': yourDate.toISOString().split('T')[0], 'exercises': saveExerciceParseToday.exercises }]));
				}
			}
		}

		app.textExercise.innerText = app.exercises[exerciseIndex];
	},

	checkExercise: function(lengthExercise, exercisesToday) {
		let exerciseIndex = Math.floor(Math.random() * lengthExercise);
		if (exercisesToday.find(x => x === exerciseIndex)) {
			exerciseIndex = app.checkExercise(lengthExercise, exercisesToday)
		}
		return exerciseIndex;
	}
};
