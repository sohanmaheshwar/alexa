// Lambda Function code for Alexa.
// Paste this into your index.js file.

const Alexa = require("ask-sdk");
const https = require("https");

const invocationName = "dog match";

const requiredSlots = [
  'size',
  'temperament',
  'energy',
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

      let updatedIntent = handlerInput.requestEnvelope.request.intent;
      let updatedSlots = updatedIntent.slots;
      

  return handlerInput.responseBuilder
    .addDelegateDirective(updatedIntent)
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

    let outputSpeech = 'here is your ' + filledSlots.size.value + ' dog that is ' + filledSlots.energy.value + ' energy and is a ' + filledSlots.temperament.value + ' dog' ;

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

    const prompt = 'There are dogs that are tiny, small medium and large' 
      + ' which would you like?';

    return handlerInput.responseBuilder
      .speak(outputSpeech + prompt)
      .reprompt(prompt)
      .getResponse();
  }
};

const LaunchRequest_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;

        let say = 'hello' + ' and welcome to ' + invocationName + ' ! Say help to hear some options.';

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
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
        AMAZON_FallbackIntent_Handler,
        AMAZON_CancelIntent_Handler,
        AMAZON_HelpIntent_Handler,
        AMAZON_StopIntent_Handler,
        AMAZON_NavigateHomeIntent_Handler,
        InProgressPetMatchIntent,
        CompletedPetMatchIntent,
        ExplainSizeIntentHandler,
        LaunchRequest_Handler,
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)

   // .addResponseInterceptors(ResponseRecordSpeechOutputInterceptor)

 // .addRequestInterceptors(RequestPersistenceInterceptor)
 // .addResponseInterceptors(ResponsePersistenceInterceptor)

 // .withTableName("askMemorySkillTable")
 // .withAutoCreateTable(true)

    .lambda();
