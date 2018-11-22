// Lambda Function code for Alexa.
// Paste this into your index.js file.

const Alexa = require("ask-sdk");
const https = require("https");

const invocationName = "pet match";

const requiredSlots = [
  'size',
  'temperament',
];


// 1. Intent Handlers =============================================

const AMAZON_FallbackIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        return responseBuilder
            .speak('Sorry I didnt catch what you said, ')
            .reprompt('I didnt get that')
            .getResponse();
    },
};

const AMAZON_CancelIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let say = 'Okay, talk to you later! ';

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const AMAZON_HelpIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'You asked for help. ';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const AMAZON_StopIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let say = 'Okay, talk to you later! ';

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const AMAZON_NavigateHomeIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from AMAZON.NavigateHomeIntent. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};


const InProgressPetMatchIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'
      && request.intent.name === 'DogMatchIntent'
      && request.dialogState !== 'COMPLETED';
  },

  handle(handlerInput) {
      
	    const currentIntent = handlerInput.requestEnvelope.request.intent;
	    const attributesManager = handlerInput.attributesManager;
	    const sessionAttributes = attributesManager.getSessionAttributes();

	    if(sessionAttributes[currentIntent.name]) {
	      const tempSlots = sessionAttributes[currentIntent.name].slots;
	      for(var key in tempSlots) {
	        // If we captured the value before and current intent is not capturing that same slot then store it to currentIntent 
		if (tempSlots[key].value && !currentIntent.slots[key].value) {
		  currentIntent.slots[key] = tempSlots[key];
		}
	      }
	    }
	    sessionAttributes[currentIntent.name] = currentIntent;
	    attributesManager.setSessionAttributes(sessionAttributes);
    	

      /*
      let updatedIntent = handlerInput.requestEnvelope.request.intent;
      let updatedSlots = updatedIntent.slots;
      */
      

  return handlerInput.responseBuilder
    //.addDelegateDirective(updatedIntent)
    .addDelegateDirective(currentIntent)
    .getResponse();
  }
};


const CompletedPetMatchIntent =  {
canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'
      && request.intent.name === 'DogMatchIntent'
      && request.dialogState === 'COMPLETED';
  },
  async handle(handlerInput) {
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;

    //let outputSpeech = 'here is your ' + filledSlots.size.value + ' dog that is a ' + filledSlots.temperament.value + ' dog' ;
    let outputSpeech = "Excellent! I have got the perfect suggestion for a " + filledSlots.size.value + "," + filledSlots.temperament.value + " dog";

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
 };
 
 const ExplainSizeIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ExplainSizeIntent';
  },
  handle(handlerInput) {

    const size = handlerInput.requestEnvelope.request.intent.slots.size.value;
    let unitOfMeasurement = handlerInput.requestEnvelope.request.intent.slots.unitOfMeasurement.value;

    if (!unitOfMeasurement) {
      unitOfMeasurement = 'pounds';
    }

    let outputSpeech = 'A ' + size + ' dog is ' 
      + sizeChart[size][unitOfMeasurement] + ' ' + unitOfMeasurement + '. ';

    const prompt = 'There are dogs that are tiny, small medium and large.' 
      + ' Which would you like?';

    return handlerInput.responseBuilder
      .speak(outputSpeech + prompt)
      .reprompt(prompt)
      .getResponse();
  }
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const launchCount = sessionAttributes['launchCount'] || 0;

    let say = '';
        if (launchCount == 1) {
            say = 'Welcome to pet match! ';
        } else {
            say = 'Welcome back! ';
        }

    return handlerInput.responseBuilder
      .speak(say + 'I can help you find the best dog for you. ' +
        'What are two things you are looking for in a dog?')
      .reprompt('What size and temperament are you looking for in a dog?')
      .getResponse();
  },
};


const RequestPersistenceInterceptor = {
  process(handlerInput) {
    
      if(handlerInput.requestEnvelope.session['new']) {

          return new Promise((resolve, reject) => {

              handlerInput.attributesManager.getPersistentAttributes()

                  .then((sessionAttributes) => {
                      sessionAttributes = sessionAttributes || {};

                      // initialise launch count for first time
                      if(Object.keys(sessionAttributes).length === 0) {
                         sessionAttributes['launchCount'] = 0;
                      }

                      sessionAttributes['launchCount'] += 1;
                      
                      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                      handlerInput.attributesManager.savePersistentAttributes()
                          .then(() => {
                              resolve();
                          })
                          .catch((err) => {
                              reject(err);
                          });

                  });

          });

      } // end session['new']

  }
};

const SessionEndedHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler =  {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);

        return handlerInput.responseBuilder
            .speak(`Sorry, your skill got this error.  ${error.message} `)
            .reprompt(`Sorry, your skill got this error.  ${error.message} `)
            .getResponse();
    }
};

const sizeChart = {
  "tiny": {
    "pounds": "4 to 6",
    "kilograms": "1.8 to 2.7"
  },
  "small": {
    "pounds": "7 to 20",
    "kilograms": "3.8 to 9"
  },
  "medium": {
    "pounds": "21 to 54",
    "kilograms": "9.53 to 24.49"
  },
  "large": {
    "pounds": "55 to 80",
    "kilograms": "24.94 to 38.28"
  }
};

// 4. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        AMAZON_FallbackIntent_Handler,
        AMAZON_CancelIntent_Handler,
        AMAZON_HelpIntent_Handler,
        AMAZON_StopIntent_Handler,
        AMAZON_NavigateHomeIntent_Handler,
        InProgressPetMatchIntent,
        CompletedPetMatchIntent,
        ExplainSizeIntentHandler,
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)

    .addRequestInterceptors(RequestPersistenceInterceptor)
 // .addResponseInterceptors(ResponsePersistenceInterceptor)

    .withTableName("DogMatchSkillTable")
    .withAutoCreateTable(true)

    .lambda();
