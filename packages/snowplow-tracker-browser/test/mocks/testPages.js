const integrationTestPage = `<!DOCTYPE html>
<html>
    <head>
        <title>Integration test page</title>
    </head>
    <body>
        <p id="title">Page for sending requests to request_recorder</p>

        <script>
            document.body.className += ' loaded'
        </script>

        <script>
            ;(function(p, l, o, w, i, n, g) {
                if (!p[i]) {
                    p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []
                    p.GlobalSnowplowNamespace.push(i)
                    p[i] = function() {
                        ;(p[i].q = p[i].q || []).push(arguments)
                    }
                    p[i].q = p[i].q || []
                    n = l.createElement(o)
                    g = l.getElementsByTagName(o)[0]
                    n.async = 1
                    n.src = w
                    g.parentNode.insertBefore(n, g)
                }
            })(window, document, 'script', './js/sp.js', 'snowplow')
            window.snowplow('newTracker', 'cf', '127.0.0.1:8181', {
                encodeBase64: true,
                appId: 'CFe23a',
				platform: 'mob',
                contexts: {
                    webPage: true,
                },
            })
            // Add a global context
            var geolocationContext = {
                schema: 'iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0',
                data: {
                    latitude: 40.0,
                    longitude: 55.1,
                },
            }
            function eventTypeContextGenerator(args) {
                var context = {}
                context['schema'] = 'iglu:com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-1'
                context['data'] = {}
                context['data']['osType'] = 'ubuntu'
                context['data']['osVersion'] = '2018.04'
                context['data']['deviceManufacturer'] = 'ASUS'
                context['data']['deviceModel'] = String(args['eventType'])
                return context
            }
            // A filter that will only attach contexts to structured events
            function structuredEventFilter(args) {
                return args['eventType'] === 'se'
            }
            function erroneousContextGenerator(args) {
                return {}
            }
            window.snowplow('addGlobalContexts', [erroneousContextGenerator])
            window.snowplow('addGlobalContexts', [[structuredEventFilter, [eventTypeContextGenerator, geolocationContext]]])
            window.snowplow('setUserId', 'Malcolm')
            window.snowplow('trackPageView', 'My Title', [
                // Auto-set page title; add page context
                {
                    schema: 'iglu:com.example_company/user/jsonschema/2-0-0',
                    data: {
                        userType: 'tester',
                    },
                },
            ])

            // This should have different pageViewId in web_page context
            window.snowplow('trackPageView')
            window.snowplow('trackStructEvent', 'Mixes', 'Play', 'MRC/fabric-0503-mix', '', '0.0')
            window.snowplow(
                'trackUnstructEvent',
                {
                    schema: 'iglu:com.acme_company/viewed_product/jsonschema/5-0-0',
                    data: {
                        productId: 'ASO01043',
                    },
                },
                [],
                { type: 'ttm', value: 1477401868 }
            )
            var orderId = 'order-123'
            window.snowplow('addTrans', orderId, 'acme', '8000', '100', '50', 'phoenix', 'arizona', 'USA', 'JPY')

            // addItem might be called for each item in the shopping cart,
            // or not at all.
            window.snowplow('addItem', orderId, '1001', 'Blue t-shirt', 'clothing', '2000', '2', 'JPY')

            // trackTrans sends the transaction to Snowplow tracking servers.
            // Must be called last to commit the transaction.
            window.snowplow('trackTrans')

            var testAcceptRuleSet = {
                accept: ['iglu:com.acme_company/*/jsonschema/*-*-*'],
            }
            var testRejectRuleSet = {
                reject: ['iglu:com.acme_company/*/jsonschema/*-*-*'],
            }
            // test context rulesets
            window.snowplow('addGlobalContexts', [[testAcceptRuleSet, [eventTypeContextGenerator, geolocationContext]]])

            window.snowplow(
                'trackUnstructEvent',
                {
                    schema: 'iglu:com.acme_company/viewed_product/jsonschema/5-0-0',
                    data: {
                        productId: 'ASO01042',
                    },
                },
                [],
                { type: 'ttm', value: 1477401869 }
            )

            window.snowplow('removeGlobalContexts', [[testAcceptRuleSet, [eventTypeContextGenerator, geolocationContext]]])
            window.snowplow('addGlobalContexts', [[testRejectRuleSet, [eventTypeContextGenerator, geolocationContext]]])
            window.snowplow(
                'trackUnstructEvent',
                {
                    schema: 'iglu:com.acme_company/viewed_product/jsonschema/5-0-0',
                    data: {
                        productId: 'ASO01041',
                    },
                },
                [],
                { type: 'ttm', value: 1477401868 }
            )

            // track unhandled exception
            window.snowplow('enableErrorTracking')

            // Test for exception handling
            function raiseException() {
                notExistentObject.notExistentProperty()
            }
            setTimeout(raiseException, 200)
        </script>
    </body>
</html>`

module.exports = {
    integrationTestPage
}