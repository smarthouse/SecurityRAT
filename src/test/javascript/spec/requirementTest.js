describe('Protractor Security RAT general testsuite', function() {
	var entities = element(by.partialLinkText('Entities'));
	var confirmDelete = element(by.css('button[ng-disabled="deleteForm.$invalid"]'));
	var skeletonRepeater = "requirementSkeleton in requirementSkeletons | filterCategoryForEntities : selectedCategory:'reqCategory'| filterByTagForReqSkeletons : selectedTags | filterByCollsForReqSkeletons : selectedColls| filterByTypesForReqSkeletons : selectedTypes | orderBy : ['reqCategory.showOrder','showOrder'] track by requirementSkeleton.id"; 
	
	beforeEach(function() {
		browser.get(browser.params.testHost);
		
	});
	var deleteSkeleton = function() {
		var deletes = element.all(by.css('button[class="btn btn-danger btn-sm"]'));
		var instanceOrders = element.all(by.repeater(skeletonRepeater)
				.column('requirementSkeleton.shortName'));
		instanceOrders.each(function(elem, indexElem) {
			elem.getText().then(function(elemText) {
				if(elemText === "TEST-01") {
					deletes.get(indexElem).click();
					browser.sleep(2000);
					element.all(by.buttonText('Delete')).last().click();
					browser.sleep(1000);
				}
			}, function(){})
		});
	}
	 
	it('searching a requirement category', function() {
		entities.click();
		element(by.partialLinkText('Requirement Categories')).click();
		element(by.id('searchQuery')).sendKeys('Lifecycle');
		element(by.partialButtonText('Search a Requirement Category')).click();
		expect(element.all(by.repeater("reqCategory in reqCategorys | orderBy:'showOrder'")).count()).toBe(1);
		
	});
	
	it('administering requirement category', function() {
		entities.click();
		element(by.partialLinkText('Requirement Categories')).click();
		element.all(by.repeater("reqCategory in reqCategorys | orderBy:'showOrder'"))
		.then(function(categoryArray) {
			var count = categoryArray.length;
			count++;
			element(by.buttonText('Create a new Requirement Category')).click();
			browser.sleep(2000);
			expect(element(by.buttonText("Save")).isEnabled()).toBe(false);
			element(by.id('field_shortcut')).sendKeys('TEST');
			element(by.id('field_name')).sendKeys('test category name <script>alert(1)</script>');
			element(by.id('field_description')).sendKeys('test Category description <script>alert(1)</script>');
			element(by.id('field_showOrder')).sendKeys('1000');
			element(by.buttonText("Save")).click();
			browser.sleep(3000);
			expect(element.all(by.repeater("reqCategory in reqCategorys | orderBy:'showOrder'")).count()).toBe(count);
		});
		element.all(by.buttonText("Edit")).last().click();
		browser.sleep(2000);
		element(by.id('field_description')).clear().then(function(){
			element(by.id('field_description')).sendKeys("test Category description modification <script>alert(1)</script>");
		});
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		
		element(by.buttonText("Save")).click();
		browser.sleep(2000);
		element.all(by.buttonText("Delete")).last().click();
		browser.sleep(2000);
		element.all(by.buttonText("Delete")).last().click();
	});
	
	it('bulk change collection category', function() {
		entities.click();
		element(by.partialLinkText('Requirement Categories')).click();
		element(by.buttonText("Select")).click();
		element(by.linkText("Select all")).click();
		browser.sleep(1000);
		expect(element(by.buttonText("Bulk change with selected")).isPresent()).toBe(true);
		element(by.buttonText("Bulk change with selected")).click();
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
		browser.sleep(5000);
		element(by.buttonText("Select")).click();
		element(by.linkText("Select all")).click();
		browser.sleep(1000);
		expect(element(by.buttonText("Bulk change with selected")).isPresent()).toBe(true);
		element(by.buttonText("Bulk change with selected")).click();
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
	});
	
	it('searching a requirement skeleton', function() {
		entities.click();
		element(by.partialLinkText('Requirement Skeletons')).click();
		element(by.id('searchQuery')).sendKeys('Lifecycle');
		element(by.partialButtonText('Search a Requirement Skeleton')).click();
		expect(element.all(by.repeater(skeletonRepeater)).count()).toBeGreaterThan(3);
		browser.sleep(2000);
		element(by.id('searchQuery')).clear().then(function(){});
		element(by.partialButtonText('Search a Requirement Skeleton')).click();		
		element(by.buttonText("Category")).click();
		element.all(by.linkText("Lifecycle")).first().click();
		expect(element.all(by.repeater(skeletonRepeater)).count()).toBeGreaterThan(3);
		browser.sleep(2000);
		element.all(by.linkText("Lifecycle")).first().click();
		element(by.buttonText("Category")).click();
		element(by.buttonText("Tags")).click();
		element(by.linkText("Requirement Owner")).click();
		element.all(by.linkText("Product Manager")).first().click();
		expect(element.all(by.repeater(skeletonRepeater)).count()).toBeGreaterThan(3);
		element.all(by.linkText("Product Manager")).first().click();
		element(by.linkText("Requirement Owner")).click();
	});
	
	it('administring a tag Instances', function() {
		entities.click();
		element(by.partialLinkText('Requirement Skeletons')).click();
		browser.sleep(2000);
		deleteSkeleton();
		element.all(by.repeater(skeletonRepeater))
		.then(function(instanceArray) {
			var count = instanceArray.length;
			count++;
			element(by.buttonText('Create a new Requirement Skeleton')).click();
			browser.sleep(2000);
			expect(element(by.buttonText("Save")).isEnabled()).toBe(false);
			element(by.cssContainingText('option', 'Lifecycle')).click();
			element(by.id('field_shortName')).sendKeys('TEST-01');
			element(by.id('field_description')).sendKeys('test skeleton description <script>alert(1)</script>');
			element(by.id('field_showOrder')).sendKeys('10000');
			var tagInstanceCheckboxes = element.all(by.css('input[ng-click="toggleSelection(requirementSkeleton.tagInstances, tagInstance)"]'));
			var collInstanceCheckboxes = element.all(by.css('input[ng-click="toggleSelection(requirementSkeleton.collectionInstances, collectionInstance)"]'));
			var typeCheckboxes = element.all(by.css('input[ng-click="toggleSelection(requirementSkeleton.projectTypes, projectType)"]'));
			tagInstanceCheckboxes.first().click();
			tagInstanceCheckboxes.get(3).click();
			collInstanceCheckboxes.first().click();
			collInstanceCheckboxes.get(3).click();
			typeCheckboxes.first().click();
			element(by.buttonText("Save")).click();
			browser.sleep(3000);
			expect(element.all(by.repeater(skeletonRepeater))
					.count()).toBe(count);
		});
		var instanceOrders = element.all(by.repeater(skeletonRepeater)
				.column('requirementSkeleton.shortName'));
		var edits = element.all(by.buttonText('Edit'));
		instanceOrders.each(function(element, index) {
			element.getText().then(function(elemText) {
				if(elemText === "TEST-01") {
					edits.get(index).click();
				}
			})
		});
		browser.sleep(2000);
		element(by.id('field_description')).clear().then(function(){
			element(by.id('field_description')).sendKeys("test skeleton description modification <script>alert(1)</script>");
		});
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
		browser.sleep(2000);
		deleteSkeleton();
	});
	
	it('bulk change for requirement skeleton', function() {
		entities.click();
		element(by.partialLinkText('Requirement Skeletons')).click();
		var selectButton = element.all(by.model('requirementSkeleton.selected'));
		var categories = element.all(by.repeater(skeletonRepeater)
		.column('requirementSkeleton.reqCategory.name'));
		element(by.buttonText("Select")).click();
		element(by.linkText("Select all")).click();
		browser.sleep(1000);
		expect(element(by.buttonText("Bulk change with selected")).isPresent()).toBe(true);
		element(by.buttonText("Bulk change with selected")).click();
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
		browser.sleep(6000);
		element(by.buttonText("Select")).click();
		element(by.linkText("Select all")).click();
		browser.sleep(1000);
		expect(element(by.buttonText("Bulk change with selected")).isPresent()).toBe(true);
		element(by.buttonText("Bulk change with selected")).click();
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
		selectButton.first().click();
		selectButton.get(2).click();
		element(by.buttonText("Bulk change with selected")).click();
		browser.sleep(2000);
		var tagInstanceCheckboxes = element.all(by.model('selectedTagInstances[tagInstance.id].value'));
		var collInstanceCheckboxes = element.all(by.model('selectedCollectionInstances[collectionInstance.id].value'));
		var typeCheckboxes = element.all(by.model('selectedProjectTypes[projectType.id].value'));
		tagInstanceCheckboxes.first().click();
		collInstanceCheckboxes.first().click();
		typeCheckboxes.first().click();
		element(by.buttonText('Authentication')).click();
		element(by.buttonText("Save")).click();
		browser.sleep(2000);
		element.all(by.repeater(skeletonRepeater)
				.column('requirementSkeleton.shortName')).each(function(elem, index) {
					elem.getText().then(function(elemText) {
						if(elemText === 'LC-01' || elemText === 'LC-03') {
							expect(categories.get(index).getText()).toBe("Authentication");
							selectButton.get(index).click();
						}
					})
				});
		element(by.buttonText("Bulk change with selected")).click();
		collInstanceCheckboxes.first().click();
		typeCheckboxes.first().click();
		element(by.buttonText('Lifecycle')).click();
		element(by.buttonText("Save")).click();
	});

});