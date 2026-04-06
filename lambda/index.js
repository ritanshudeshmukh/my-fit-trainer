/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

//global variables
let str_output;

let start_time_hour = 0;
let start_time_min = 0;
let end_time_hour = 0;
let end_time_min = 0;

let pause_start_hour = 0;
let pause_start_min = 0;
let pause_end_hour = 0;
let pause_end_min = 0;

let fetch_wk_type = '';
let fetch_wk_hour = 0;
let fetch_wk_min = 0;
let fetch_wk_cal = 0;

let dummy_wk_cal = 18;
let dummy_flag = '';

let pause_flag = '';
let ongoing_wk_flag = '';

let cal_per_min;
let total_cal;
let wk_type = " ";
var wk_hour;
var wk_min;
var launch_flag = '';

//launch request
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        if(launch_flag === '') {
            str_output = 'Welcome to my fit trainer app, your personal fitness tracking assistant powered by Amazon Alexa. What would you like to do today?';
            launch_flag = 'X';
        } else {
            str_output = 'what would you like to do next?';
        }
        const speakOutput = str_output;
        str_output = '';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//startIntent
const startIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'startIntent'
    },
    handle(handlerInput) {
        if(ongoing_wk_flag === '') { //there is no existing workout going on
        wk_type = handlerInput.requestEnvelope.request.intent.slots.wk_type.value;
            //if outdoor workout selected, say temprature
            if(wk_type === 'running' || wk_type === 'jogging' || wk_type === 'tennis' || wk_type === 'walking') {
                str_output = 'Since ' + wk_type + ' is an outdoor catagory workout, I would like to tell you the weather condition before starting the workout.'+
                ' The current temprature is 5 degree celsius with cloudy weather. Cold winds are expected.';
            } else {
                str_output = '';
            }
            str_output += ' Starting the workout now';
            var date_obj = new Date();
            start_time_hour = date_obj.getHours();
            start_time_min = date_obj.getMinutes();
            ongoing_wk_flag = 'X';
        } else {
            str_output = 'Sorry, you already have a ' + wk_type + ' workout going on. Kindly finish it before starting a new workout.';
        }
        const speakOutput = str_output;
        str_output = '';
        
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
};

//endIntent
const endIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'endIntent';
    },
    handle(handlerInput) {
        if(ongoing_wk_flag === '') {
            //no workout started
            str_output = 'Sorry, There is no active workout!';
        } else {
            //check if the user confirmed to end the workout or not
            var conf_status = handlerInput.requestEnvelope.request.intent.confirmationStatus;
            if(conf_status === 'CONFIRMED') {
                //define calories per minutes for the type of workout.
                switch(wk_type) {
                    //indoor workouts
                    case 'exercise bike':
                        cal_per_min = 7;
                        break;
                    case 'skipping':
                        cal_per_min = 6;
                        break;
                    case 'weight machine':
                        cal_per_min = 5;
                        break;
                    case 'treadmill':
                        cal_per_min = 8;
                        break;
                    case 'floor workout':
                        cal_per_min = 6;
                        break;
                    case 'step machine':
                        cal_per_min = 5;
                        break;
                    //outdoor workouts
                    case 'tennis':
                        cal_per_min = 11;
                        break;
                    case 'jogging':
                        cal_per_min = 6;
                        break;
                    case 'walking':
                        cal_per_min = 3;
                        break;
                    case 'running':
                        cal_per_min = 9;
                        break;
                }
                
                //calculate total workout time and calories
                var date_obj = new Date();
                end_time_hour = date_obj.getHours();
                end_time_min = date_obj.getMinutes();
                //if user tries to end a workout that is currently paused.
                var ps_hour = 0;
                var ps_min = 0;
                if(pause_flag === 'X') {
                    pause_end_hour = end_time_hour;
                    pause_end_min = end_time_min;
                    ps_hour = pause_end_hour - pause_start_hour;
                    ps_min = pause_end_min - pause_start_min;
                }
                wk_hour = (end_time_hour - start_time_hour) - ps_hour;
                wk_min = (end_time_min - start_time_min) - ps_min;
                //calculate total calories burnt
                total_cal = (((wk_hour * 60) + wk_min) * cal_per_min);
                
                //check if older data is more prominent
                if(wk_type === 'running' && total_cal < dummy_wk_cal) {
                    str_output = 'Before I end your workout, I would like to mention that your last ' + wk_type + ' workout was better than your current.' +
                    ' You need to push yourself to go that extra mile and break your own record the next time. ';
                }
                
                //set output message
                if(wk_hour > 0) {
                    str_output += wk_type + ' workout has ended. Total workout time is ' + wk_hour + ' hours and ' + wk_min + ' minutes. ' +
                    'Total calories burnt are ' + total_cal + ' kcal';
                } else {
                    str_output += wk_type + ' workout has ended. Total workout time is ' + wk_min + ' minutes. ' +
                    'Total calories burnt are ' + total_cal + ' kcal';
                }
                //initialize global variables
                total_cal = 0;
                start_time_hour = 0;
                start_time_min = 0;
                end_time_hour = 0;
                end_time_min = 0;
                ongoing_wk_flag = '';
                pause_flag = '';
                wk_hour = 0;
                wk_min = 0;
                launch_flag = '';
            }
        }
        
        const speakOutput = str_output;
        str_output = '';
                    
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
                
};

//pauseIntent
const pauseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'pauseIntent';
    },
    handle(handlerInput) {
        var conf_status = handlerInput.requestEnvelope.request.intent.confirmationStatus;
        if(conf_status === 'CONFIRMED') {
            if(ongoing_wk_flag === '') {
                //no workout started
                str_output = 'Sorry, There is no active workout!';
            } else {
                var date_obj = new Date();
                pause_start_hour = date_obj.getHours();
                pause_start_min = date_obj.getMinutes();
                str_output = 'workout paused';
                pause_flag = 'X';
            }    
        }

        const speakOutput = str_output;
        str_output = '';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

//resumeIntent
const resumeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'resumeIntent';
    },
    handle(handlerInput) {
        var conf_status = handlerInput.requestEnvelope.request.intent.confirmationStatus;
        if(conf_status === 'CONFIRMED') {
            if(pause_flag === '') {
                //no workout started
                str_output = 'Sorry, there is no paused workout to resume!';
            } else {
                var date_obj = new Date();
                pause_end_hour = date_obj.getHours();
                pause_end_min = date_obj.getMinutes();
                str_output = 'workout resumed';
                pause_flag = '';
            }    
        }
        const speakOutput = str_output;
        str_output = '';
        //add logic to resume time calculation

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

//restartIntent
const restartIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'restartIntent';
    },
    handle(handlerInput) {
        var conf_status = handlerInput.requestEnvelope.request.intent.confirmationStatus;
        if(conf_status === 'CONFIRMED') {
            if(ongoing_wk_flag === '') {
                //no workout started
                str_output = 'Sorry, there is no active workout';
            } else {
                var date_obj = new Date();
                start_time_hour = date_obj.getHours();
                start_time_min = date_obj.getMinutes();
                str_output = 'workout restarted';
            }    
        }
        const speakOutput = str_output;
        str_output = '';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// // This request interceptor will log all incoming requests to this lambda
// const LoggingRequestInterceptor = {
//     process(handlerInput) {
//         console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
//     }
// };

// // This response interceptor will log all outgoing responses of this lambda
// const LoggingResponseInterceptor = {
//     process(handlerInput, response) {
//         console.log(`Outgoing response: ${JSON.stringify(response)}`);
//     }
// };

// /* *
//  * Below we use async and await ( more info: javascript.info/async-await )
//  * It's a way to wrap promises and waait for the result of an external async operation
//  * Like getting and saving the persistent attributes
//  * */
// const LoadAttributesRequestInterceptor = {
//     async process(handlerInput) {
//         const {attributesManager, requestEnvelope} = handlerInput;
//         if (Alexa.isNewSession(requestEnvelope)){ //is this a new session? this check is not enough if using auto-delegate (more on next module)
//             const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
//             console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
//             //copy persistent attribute to session attributes
//             attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
//         }
//     }
// };

// // If you disable the skill and reenable it the userId might change and you loose the persistent attributes saved below as userId is the primary key
// const SaveAttributesResponseInterceptor = {
//     async process(handlerInput, response) {
//         if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
//         const {attributesManager, requestEnvelope} = handlerInput;
//         const sessionAttributes = attributesManager.getSessionAttributes();
//         const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
//         if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') { // skill was stopped or timed out
//             // we increment a persistent session counter here
//             sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
//             // we make ALL session attributes persistent
//             console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
//             attributesManager.setPersistentAttributes(sessionAttributes);
//             await attributesManager.savePersistentAttributes();
//         }
//     }
// };

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        startIntentHandler,
        endIntentHandler,
        pauseIntentHandler,
        resumeIntentHandler,
        restartIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    // .addRequestInterceptors(
    //     LoggingRequestInterceptor,
    //     LoadAttributesRequestInterceptor)
    // .addResponseInterceptors(
    //     LoggingResponseInterceptor,
    //     SaveAttributesResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    //.withPersistenceAdapter(persistenceAdapter)
    .lambda();