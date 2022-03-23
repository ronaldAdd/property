const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

//ini komen
function logger(op,name,err){
Sentry.init({
    dsn: "https://679a94dbd0c24f478371b1e660cabee4@o1121849.ingest.sentry.io/6158893",
    tracesSampleRate: 1.0,
    integrations: [new Tracing.Integrations.Mongo({
        useMongoose: true // Default: false
      })],
  });

  const transaction = Sentry.startTransaction({
    op: op,
    name: name,
  });

    Sentry.configureScope(scope => {
    scope.setSpan(transaction);
  });

  Sentry.captureException(err);
}

exports.logger = logger;
