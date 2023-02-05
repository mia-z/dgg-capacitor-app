import {Dispatch, FC, SetStateAction, useRef, useState} from "react";
import {IonButton, IonContent, IonicSlides, IonModal} from "@ionic/react";
import Step1Image from "../../styles/img/Step1.png";
import Step2Image from "../../styles/img/Step2.png";
import Step3Image from "../../styles/img/Step3.png";
import Step4Image from "../../styles/img/Step4.png";
import { arrowForward }  from "ionicons/icons";
import {SetHasSeenLoginInfo} from "../../lib/PreferencesHelper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperRef, Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';

import 'swiper/scss';
import 'swiper/scss/autoplay';
import 'swiper/scss/keyboard';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';
import 'swiper/scss/zoom';
import '@ionic/react/css/ionic-swiper.css';

type LoginHelpProps = {
	loginHelpOpen: boolean,
	setLoginHelpOpen: Dispatch<SetStateAction<boolean>>
}

export const LoginHelp: FC<LoginHelpProps> = ({ loginHelpOpen, setLoginHelpOpen }) => {
	const [swiperRef, setSwiperRef] = useState<SwiperRef>();

	const loginHelpDismiss = async () => {
		await SetHasSeenLoginInfo();
		setLoginHelpOpen(false);
	}

	return (
		<IonModal keepContentsMounted={true} isOpen={loginHelpOpen} onWillDismiss={loginHelpDismiss}>
			<IonContent>
				<div className={"bg-light-black h-full"}>
					<Swiper onSwiper={(instance) => setSwiperRef(instance)}
						className={"h-full"}
						initialSlide={0}
						slidesPerView={1}
						modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom, IonicSlides]}
						autoplay={false}
						keyboard={false}
						pagination={false}
						scrollbar={false}
						zoom={true}>
						<SwiperSlide>
							<div className={"relative h-full w-full flex flex-col"}>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 mt-3 work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									Third-party logins to Destiny.gg chat are not fully supported - this short guide will help you get started so you can join your fellow chatters!
									<img className={"absolute -bottom-4 -right-2"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
								</div>
								<div className={"mx-auto mt-7 w-4/5 rounded-[29px] border-2 border-blue-400 shadow-lg"}>
									<img className={""} src={Step1Image} />
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 m-auto work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									Logging in with this app will open a browser window to Destiny.gg where you can log in using your preferred OAuth method.<br />
									Log in to one of these like normal and you will be sent to your DGG website profile.
								</div>
								<div className={"mt-auto mb-2 flex-col"}>
									<IonButton onTouchEnd={() => swiperRef?.slideNext()} className={""}>
										Continue
									</IonButton>
								</div>
								<div className={"flex-col mb-2"}>
									<div onTouchEnd={() => setLoginHelpOpen(false)} className={"text-center work-sans text-sm text-[#02c2ff] underline"}>
										I know what I'm doing - close this window.
									</div>
								</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className={"relative h-full w-full flex flex-col"}>
								<div className={"mx-auto mt-7 w-4/5 rounded-[25px] border-2 border-blue-400 shadow-lg"}>
									<img className={""} src={Step2Image} />
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 m-auto work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									Once logged in, head over to the "Developers" tab using the right-most button on the navigation bar.
								</div>
								<div className={"mt-auto mb-2 flex-col"}>
									<IonButton onTouchEnd={() => swiperRef?.slideNext()} className={""}>
										Continue
									</IonButton>
								</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className={"relative h-full w-full flex flex-col"}>
								<div className={"mx-auto mt-7 w-4/5 rounded-[25px] border-2 border-blue-400 shadow-lg"}>
									<img className={""} src={Step3Image} />
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 m-auto work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									Once in the developer area, expand the "Connections" box using the small arrow on the left. <br />
									Press the (show) link in the Application column to show your login key.
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 mt-3 work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									If you dont have a login key, just press the "Add login key" button and complete the reCaptcha!
									<img className={"absolute -bottom-4 -right-2"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
								</div>
								<div className={"mt-auto mb-2 flex-col"}>
									<IonButton onTouchEnd={() => swiperRef?.slideNext()} className={""}>
										Continue
									</IonButton>
								</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className={"relative h-full w-full flex flex-col"}>
								<div className={"mx-auto mt-7 w-4/5 rounded-[25px] border-2 border-blue-400 shadow-lg"}>
									<img className={""} src={Step4Image} />
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 m-auto work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									With your login key showing, long-press on it to highlight it all and open a context menu. <br />
									Once the context menu is open, press "Copy". <br />
									Return to the login screen by repeatedly using your device's back button, or closing the browser using the X in the top left.
								</div>
								<div className={"relative text-light-black rounded p-3 text-center w-4/5 mt-3 work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
									You're pretty much done - once you return back to the login screen, you'll be automatically logged in!
									<img className={"absolute -bottom-4 -right-2"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
								</div>
								<div className={"mt-auto mb-2 flex-col"}>
									<IonButton onTouchEnd={() => { setLoginHelpOpen(false); swiperRef?.slideTo(0) }} className={""}>
										Done!
									</IonButton>
								</div>
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
			</IonContent>
		</IonModal>
	);
}