import React, { FC, useContext, useEffect } from "react";
import { IonApp, IonContent, IonText, IonPage, IonHeader, IonTitle, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { BigScreen } from "./pages/BigScreen";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./pages/Login";
import { ResetSeenLoginInfo } from "./lib/PreferencesHelper";
import { Capacitor } from "@capacitor/core";

//polyfill for array.at
import "core-js/features/array/at";

const queryClient = new QueryClient();

setupIonicReact({
	mode: Capacitor.getPlatform() === "ios" ? "ios" : "md"
});

//await ResetSeenLoginInfo();

export const App: FC = () => {
    return (
		<IonApp>
			<QueryClientProvider client={queryClient}>
				<IonReactRouter>
					<IonRouterOutlet>
						<Route path="/bigscreen" component={BigScreen} exact={true} />
						<Route path="/login" component={Login} exact={true} />
						<Route exact path="/" render={() => <Redirect to="/bigscreen" />} />
					</IonRouterOutlet>
				</IonReactRouter>
			</QueryClientProvider>
		</IonApp>
	);
}

export default App;
