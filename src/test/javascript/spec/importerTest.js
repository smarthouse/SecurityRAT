describe('Protractor Security RAT importer testsuite', function() {
	var importArtifact = element(by.id('importArtifact'));
	var defineArtifact = element(by.id('defineArtifact'));
	var path = require('path');
	var closeButton = "Close";
	var exportButton = "Export";
	var SaveButton = "Save";
	var deleteCookie = function() {
		browser.getAllWindowHandles().then(function(handles) {
			expect(handles.length).toBeGreaterThan(1);
			browser.switchTo().window(handles[1]).then(function() {
				browser.manage().getCookie("JSESSIONID").then(function(cookie) {
					browser.manage().deleteCookie("JSESSIONID");
					browser.switchTo().window(handles[0]).then();
				});				
			});
		});
	}
	it('imports by clicking on the link with parameter file and export them again', function() {
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[0]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(10000);
		element(by.buttonText("Close")).click()
		browser.sleep(3000);
		
		(element(by.buttonText(SaveButton))).click();
		browser.sleep(3000);
		(element(by.buttonText("Export"))).click();
		browser.sleep(5000);
		element(by.buttonText("Close")).click();
		
		
	});
	
	it('imports by clicking on the link with parameter ticket and export them again', function() {
		browser.get(browser.params.impTestUrl2).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(5000);
		var list = element.all(by.options('attachment.downloadUrl as attachment.label for attachment in attachmentProperties.attachments'));
		expect(list.count()).toBeGreaterThan(3);
		
		element(by.buttonText("Import")).click();
		browser.sleep(10000);
		element(by.buttonText('Close')).isPresent().then(function(v){ 
		    expect(v).toBe(true);
		});
		element(by.buttonText("Close")).click();
	});
	
	it('Imports by giving the ticket url in modal', function() {
		browser.get(browser.params.testHost);
		browser.sleep(5000);
		importArtifact.click();
		element(by.model("jiraLink.url")).sendKeys(browser.params.jiraQueue + issueNumbers[1]);
		element(by.buttonText("Import")).click();
		browser.sleep(5000);
		var list = element.all(by.options('attachment.downloadUrl as attachment.label for attachment in attachmentProperties.attachments'));

		element(by.model('attachmentProperties.selectedAttachment')).sendKeys(list.get(1).getText());
		element(by.buttonText("Import")).click();
		browser.sleep(5000);
		element(by.buttonText("Close")).click();
	});
	//save requirement set to yaml file.
	it('save requirement set to yaml file.', function() {
		browser.get(browser.params.testHost);
		defineArtifact.click();
		var artifactName = element(by.model('starterForm.name'));
		artifactName.sendKeys("some artifact");
		element.all(by.buttonText('Select')).last().click();
		(element(by.linkText('Internal'))).click();
		element.all(by.buttonText('Select')).each(function(elemt, index) {
			elemt.click().then(function() {
				element(by.linkText('High')).isPresent().then(function(isInternally){
					if(isInternally) {
						element(by.linkText('High')).click();
					}else {
						element(by.linkText('Mobile App')).isPresent().then(function(isMobile){
							if(isMobile) {
								element(by.linkText('Mobile App')).click();
							}else {
								elemt.click();
							}
						});
					}
				});
			});
		});
		element(by.buttonText('High')).click();
		(element(by.linkText('Low'))).click();
		(element(by.buttonText("Generate"))).click();
		var list = element.all(by.tagName('textarea'));
		var list = element.all(by.tagName('textarea'));
		list.first().sendKeys("export into file");
		list.get(1).sendKeys("custom motivation");
		
		
		(element(by.buttonText(SaveButton))).click();
		(element(by.linkText('Export into File'))).click();
		(element(by.buttonText("Export"))).click();
		browser.sleep(3000);
		element(by.css('a[download]')).isPresent().then(function(v){ 
		    expect(v).toBe(true);
		});
		
		expect(element.all(by.css('a[download]')).count()).toBe(1);
		var filename = ''; 
		element(by.css('a[download]')).getAttribute('download').then(function(value) {
			browser.get(browser.params.testHost);
			importArtifact.click();
			browser.sleep(1000);
			(element(by.linkText('Import from File'))).click();
			var fileToUpload = '../../../../../Downloads/' + value;
			 var absolutePath = path.resolve(__dirname, fileToUpload);
			
			var input = element(by.id('fileUpload'));
			
			input.sendKeys(absolutePath);
			browser.sleep(3000);
			(element(by.buttonText("Import"))).click();
			browser.sleep(2000);
			browser.wait(function() {
				return element(by.buttonText('Close')).isPresent();
			});
			element(by.buttonText('Close')).click();
		});
	});
	
	it('Import with invalid Url', function() {
		browser.get(browser.params.testHost + '?file=ww.asdasfd').then(function() {}, function(){
			browser.switchTo().alert().accept();
		});
		expect(element(by.css('div[marked]')).getText()).toBe('Invalid url in query parameter file.');
		element(by.buttonText("Close")).click();
		browser.get(browser.params.testHost + '?ticket=ww.asdasfd').then(function() {}, function(){
			browser.switchTo().alert().accept();
		});
		expect(element(by.binding('failMessage')).getText()).toBe('The entered URL is invalid. Please provide a valid URL');
	});
	
//	it('Import with old URL structure', function() {
//		browser.get(browser.params.impTestAttachmentUrl + "685629").then(function() {}, function(){
//			browser.switchTo().alert().accept();
//		});
//		browser.sleep(5000);
//		(element(by.buttonText('Close'))).click();
//		browser.sleep(3000);
//		element(by.buttonText('Updates available')).isPresent().then(function(v){ 
//		    element(by.buttonText('Updates available')).click();
//		    browser.wait(function() {
//				return element(by.buttonText('Close')).isPresent();
//			});
//		    browser.sleep(3000);
//		    element(by.buttonText('Close')).click();
//		    browser.sleep(3000);
//		    expect(element(by.buttonText('Updates available')).isEnabled()).toBe(false);
//		    expect(element(by.buttonText(SaveButton)).isEnabled()).toBe(false);
//		    expect(element.all(by.id("feedbackIcon")).count()).toBe(0);
//		    var acceptList = element.all(by.id('acceptReq'));
//		    
//		    var x = 0;
//		    acceptList.each(function(element, index) {
//		    	if(x <= 20)
//		    		element.click();
//		    	x++;
//		    });
//		    browser.sleep(3000);
//		    var removeList = element.all(by.id('removeReq'));
//		    removeList.each(function(element, index) {
//		    		element.click();
//		    });
//		    browser.sleep(10000);
//		});
//	});
	
	it('Import with deleted attachment', function() {
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[1]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		});
		browser.sleep(10000);
		expect(element.all(by.css('div[marked]')).get(1).getText()).toBe('No attachment with this id was found.');
	});
	
	it('import with link to attachment content in file query parameter', function() {
		browser.get(browser.params.impTestFileUrl).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		expect(element(by.css('div[marked]')).getText()).toBe('Invalid url in query parameter file. Please enter a valid JIRA ticket with an attachment.');
	});
	
	it('Imports by giving the ticket url without being authenticated', function() {
		deleteCookie();
		browser.get(browser.params.testHost);
		browser.sleep(5000);
		importArtifact.click();
		element(by.model("jiraLink.url")).sendKeys(browser.params.jiraQueue + issueNumbers[1]);
		element(by.buttonText("Import")).click();
		browser.sleep(1000);
		element(by.binding('jira.url')).click();
		browser.getAllWindowHandles().then(function(handles) {
			expect(handles.length).toBeGreaterThan(1);
			browser.switchTo().window(handles[0]).then();
		});
		browser.sleep(65000);
		expect(element(by.css('div[marked]')).getText()).toBe('You could not authenticate yourself within the time interval! Please try later.');
		element(by.buttonText("Close")).click();
		browser.sleep(3000);
		element(by.buttonText("Import")).click();
		browser.sleep(1000);
		element(by.binding('jira.url')).click();
		browser.sleep(15000);
		var list = element.all(by.options('attachment.downloadUrl as attachment.label for attachment in attachmentProperties.attachments'));
		expect(list.count()).toBeGreaterThan(1);
		element(by.buttonText("Import")).click();
		browser.sleep(5000);
		element(by.buttonText("Close")).click();
	});
	
	it('imports by clicking on the link without being authenticated', function() {
		deleteCookie();
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[0]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(1000);
		element(by.binding('jira.url')).click();
		browser.getAllWindowHandles().then(function(handles) {
			expect(handles.length).toBeGreaterThan(1);
			browser.switchTo().window(handles[0]).then();
		});
		browser.sleep(65000);
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[0]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(1000);
		element(by.binding('jira.url')).click();
		browser.sleep(20000);
		element(by.buttonText("Close")).click();
	});
	it('imports from file with ', function() {
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[2]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(5000);
		element(by.binding('jira.url')).click();
		browser.getAllWindowHandles().then(function(handles) {
			expect(handles.length).toBeGreaterThan(1);
			browser.switchTo().window(handles[0]).then();
		});
		browser.sleep(65000);
		browser.get(browser.params.impTestAttachmentUrl + attachmentUrls[2]).then(function() {}, function(){
			browser.switchTo().alert().accept();
		})
		browser.sleep(5000);
		element(by.binding('jira.url')).click();
		browser.sleep(20000);
		element(by.buttonText("Close")).click();
	});
});