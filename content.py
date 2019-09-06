header_html="""\
<!doctype html>
<html">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>LiveIntent Template</title>
	<style type="text/css">

		.ReadMsgBody {{
			width:100%;
			background-color:#ffffff;
		}}

		.ExternalClass {{
			width:100%;
			background-color:#ffffff;
		}}

		body {{
			width:100%;
			background-color:#ffffff;
			margin:0;
			padding:0;
			-webkit-font-smoothing:antialiased;
			font-family:Verdana, Geneva, sans-serif;
		}}

		table {{
			border-collapse:collapse;
			border-spacing: 0px;
		}}

		p {{
			margin:0; padding:0; margin-bottom:8px;
		}}

		@media only screen and (max-width: 768px){{
			.article_header {{padding: 3px !important;}}
		}}

		/*@media only screen and (max-width: 640px){{
			.deviceWidth {{
				width:440px !important;
				padding:0;
			}}
			.center {{
				text-align:center !important;
			}}
			span[id=switcher_tall] {{
				display:block;
				margin: 0 auto;
				background-image: url(https://www.emailonacid.com/images/emails/live_intent/slot2.jpg) !important;
				background-repeat: no-repeat !important;
				background-position: center !important;
				width: 300px !important;
				height: 250px !important; }}
			span[id=switcher_wide] {{
				display:block;
				margin: 0 auto;
				background-image: url(https://www.emailonacid.com/images/emails/live_intent/slot2.jpg) !important;
				background-repeat: no-repeat !important;
				background-position: center !important;
				width: 300px !important;
				height: 250px !important; }}
			img[class=houdini] {{
				display: none !important;
			}}
			.right_ad_container {{
				width: 100% !important;
			}}
			.mobile_center {{
				width:100% !important; text-align: center;
			}}
			.mobile_center2 {{
				margin:0 auto !important;
			}}
			.mobile_center3 {{
				width:100% !important; text-align: center;max-width:100% !important;margin:0 auto;
			}}

		}}


		@media only screen and (max-width: 479px) {{
			.mobile_splitter {{
				display:block;
				width:300px;
				height:1px;
				clear:both;
			}}
			.deviceWidth {{
				width:300px !important;
				padding:0;
			}}
			.magic_td {{
				position: absolute;
			}}
		}}*/

	</style>
</head>
<body marginwidth="0" style="font-family:Verdana, Geneva, sans-serif;" marginheight="0" topmargin="0" leftmargin="0">
	<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
		<tr>
			<td width="100%" valign="top" bgcolor="" style="padding-top:20px;">
				<!-- START INNER MAIN CONTAINER -->
 				<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="deviceWidth" style="margin:0 auto;">
 					
					<tr>
						<td width="600" style="vertical-align:middle;" valign="middle" height="60" class="center deviceWidth">
							<!--[if gte mso 9]>
							<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:60px;">
							<v:fill type="tile" src="https://www.emailonacid.com/images/emails/live_intent/header-bg-repeat.jpg" color="#d8d8d8" />
							<v:textbox inset="0,0,0,0">
							<![endif]-->
								<table width="600" style="background-repeat: repeat;text-align: center;color: #000000;vertical-align:middle;" valign="middle" height="60" class="center deviceWidth">
									<tr>
										<td valign="middle" height="60">
											<table border="0" cellpadding="0" cellspacing="0" width="100%">
					                            <tr>
					                                <td align="left" valign="top">
					                                   <font size="4.5"><b>REC</b> <font color="#777777">Study of better video recommendation system </font></font>
					                                   <hr color="#dddddd">
					                                </td>
					                            </tr>
					                            <tr>
					                              <td align="left" valign="top">
					                                  <font size="3">Today's recommendations for {participant_name}</font>
					                              </td>
					                            </tr>
					                        </table>
										</td>
									</tr>
								</table>
							<!--[if gte mso 9]>
							</v:textbox>
							</v:rect>
							<![endif]-->
						</td>
					</tr>
					
				</table>
				
				<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="deviceWidth" style="margin:0 auto;">
					<tr>
						<td>
							<p style="mso-table-lspace:0;mso-table-rspace:0;margin:0;">
								<table border="0" cellpadding="0" cellspacing="0" width="100%" align="left">
									<tr>
										<td style="padding:0px;">"""

item_html = """
<table border="0" cellpadding="0" cellspacing="0" width="100%">
												<tr>
													<td style="line-height: 20px;font-size:20px;" height="20">&nbsp;
													</td>
												</tr>
											</table>
											<table border="0" cellpadding="0" cellspacing="0" >
												<tr>
													<td>
														<div width="100%" style="color:#ffffff;height:21px;border-bottom: 3px solid #004D7F;">
															<span style="background-color:#004D7F;padding:5px;text-transform:uppercase;font-size:11px;line-height:21px;">{category}</span>
														</div>
													</td>
												</tr>
												<tr>
													<td valign="middle">
														<table align="left" height="100%" width="30%" cellpadding="0" cellspacing="0" border="0" class="deviceWidth">
															<tr>
																<td valign="middle" align="left" class="center" >
																	<!-- <p style="mso-table-lspace:0;mso-table-rspace:0;margin:0;"> -->
																	<p>
																		<a href="{video_url}">
																			<img src="{thumbnails_url}" alt="" border="0" style="width:160px;display:block;height:120px; margin-top: 5px;" class="deviceWidth" />
																		</a>
																	</p>
																</td>
															</tr>

														</table>
														<table align="right" height="120px" width="59%" cellpadding="0" cellspacing="0" border="0" class="deviceWidth">
															<tr>
																<td>
																	<div width="100%" style="color: #000000;padding:0px;margin-bottom: 0px;">
																		<p href="{video_url}" style="color: #000000;text-decoration:none;font-size:13px;font-weight: bold;">{title}</p>
																	</div>
																</td>
															</tr>
															<tr>
																<td>
																	<div width="100%" style="font-size:14px;color: #000000;padding:0px;">
																		<p style="color: #333333;text-decoration:none;font-size:10px;font-weight: normal;">{description}</p>
																	</div>
																</td>
															</tr>
															<tr valign="bottom" height>
																<td valign="bottom">
																	<font style="color: #646464;text-decoration:none;font-size:12px;font-weight: normal;"><a href="{channel_url}" style="color: #646464;text-decoration:underline;font-size:12px;font-weight: normal;">{channel_name}</a> | Published on {pub_time}</font>
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
"""


footer_html = """
										</td>
									</tr>
								</table>
							</p>
							
						</td>
						<tr>
							<td style="line-height: 20px;font-size:20px;" height="20">&nbsp;
							</td>
						</tr>
					</tr>
				</table>


				<table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="deviceWidth" style="margin:0 auto;">
					<tr>
						<td style="line-height: 20px;font-size:20px;" height="20">&nbsp;</td>
					</tr>
					<tr>
						<td>
							<table bgcolor="#D6D5D5" border="0" cellpadding="10" cellspacing="0" width="100%" id="emailFooter">
                            <tr>
                                <td align="center" valign="bottom">
                                    <font size="3" color="#004D7F">Small Data Lab @ Cornell Tech</font>
                                </td>
                            </tr>
                            <tr>
                              <td align="center" valign="middle">
                                <font size="2" color="#004D7F">Contact: sy684@cornell.edu  yw2224@cornell.edu</font>
                              </td>
                            </tr>
                        </table>
						</td>
					</tr>
					<tr>
						<td style="line-height: 20px;font-size:20px;" height="20">&nbsp;</td>
					</tr>
				</table>

				<!-- END INNER MAIN CONTAINER -->
			</td>
		</tr>
	</table>
<div style="display:none;white-space:nowrap;font:15px courier;color:#ffffff;">
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
</div>
</body>
</html>
"""