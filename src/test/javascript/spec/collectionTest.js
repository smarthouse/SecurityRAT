describe('Protractor Security RAT general testsuite', function() {
	var entities = element(by.partialLinkText('Entities'));
	var confirmDelete = element(by.css('button[ng-disabled="deleteForm.$invalid"]'));
	var collRepeater = "collectionCategory in collectionCategorys | orderBy: 'showOrder'";
	var collInsRepeater = "collectionInstance in collectionInstances | filterCategoryForEntities: selectedCategory: 'collectionCategory' | orderBy: ['collectionCategory.showOrder','showOrder']"; 
	
	beforeEach(function() {
		browser.get(browser.params.testHost);
		
	});
	var deleteCollectionInstance = function() {
		var deletes = element.all(by.css('button[class="btn btn-danger btn-sm"]'));
		var instanceOrders = element.all(by.repeater(collInsRepeater)
				.column('collectionInstance.showOrder'));
		instanceOrders.each(function(elem, indexElem) {
			var toDelete = false;
			elem.getText().then(function(elemText) {
				if(elemText === "1000") {
					toDelete = true;
					deletes.get(indexElem).click();
					browser.sleep(2000);
					element.all(by.buttonText('Delete')).last().click();
					browser.sleep(1000);
				}
			}, function(){})
		});
	}
	 
	it('searching a collection category', function() {
		entities.click();
		element(by.partialLinkText('Collection Categories')).click();
		element(by.id('searchQuery')).sendKeys('criticality');
		element(by.partialButtonText('Search a Collection Category')).click();
		expect(element.all(by.repeater(collRepeater)).count()).toBe(1);
		
	});
	
	it('administering collection category', function() {
		entities.click();
		element(by.partialLinkText('Collection Categories')).click();
		element.all(by.repeater("collectionCategory in collectionCategorys | orderBy: 'showOrder'"))
		.then(function(categoryArray) {
			var count = categoryArray.length;
			count++;
			element(by.buttonText('Create a new Collection Category')).click();
			browser.sleep(2000);
			expect(element(by.buttonText("Save")).isEnabled()).toBe(false);
			element(by.id('field_name')).sendKeys('test Category name <script>alert(1)</script>');
			element(by.id('field_description')).sendKeys('test Category description <script>alert(1)</script>');
			element(by.id('field_showOrder')).sendKeys('1000');
			element(by.buttonText("Save")).click();
			browser.sleep(3000);
			expect(element.all(by.repeater(collRepeater)).count()).toBe(count);
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
		element(by.partialLinkText('Collection Categories')).click();
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
	
	it('searching a collection Instance', function() {
		entities.click();
		element(by.partialLinkText('Collection Instances')).click();
		element(by.id('searchQuery')).sendKeys('Criticality');
		element(by.partialButtonText('Search a Collection Instance')).click();
		expect(element.all(by.repeater(collInsRepeater)).count()).toBeGreaterThan(1);
		browser.sleep(2000);
		element(by.id('searchQuery')).clear().then(function(){
		});
		element(by.partialButtonText('Search a Collection Instance')).click();		
		element(by.buttonText("Collection Category")).click();
		element(by.linkText("Criticality")).click();
		expect(element.all(by.repeater(collInsRepeater)).count()).toBeGreaterThan(1);
		browser.sleep(2000);
		element(by.linkText("Criticality")).click();
		element(by.buttonText("Collection Category")).click();
	});
	
	
	it('adminisetring collection Instances', function() {
		entities.click();
		element(by.partialLinkText('Collection Instances')).click();
		browser.sleep(2000);
		deleteCollectionInstance();
		element.all(by.repeater(collInsRepeater))
		.then(function(instanceArray) {
			var count = instanceArray.length;
			count++;
			element(by.buttonText('Create a new Collection Instance')).click();
			browser.sleep(2000);
			expect(element(by.buttonText("Save")).isEnabled()).toBe(false);
			element(by.id('field_name')).sendKeys('test Instance name <script>alert(1)</script>');
			element(by.id('field_description')).sendKeys('test Instance description <script>alert(1)</script>');
			element(by.id('field_showOrder')).sendKeys('1000');
			element(by.cssContainingText('option', 'Criticality')).click();
			element(by.buttonText("Save")).click();
			browser.sleep(3000);
			expect(element.all(by.repeater(collInsRepeater))
					.count()).toBe(count);
		});
		var instanceOrders = element.all(by.repeater(collInsRepeater)
				.column('collectionInstance.showOrder'));
		var edits = element.all(by.buttonText('Edit'));
		instanceOrders.each(function(element, index) {
			element.getText().then(function(elemText) {
				if(elemText === "1000") {
					edits.get(index).click();
				}
			})
		});
		browser.sleep(2000);
		element(by.id('field_description')).clear().then(function(){
			element(by.id('field_description')).sendKeys("test Category description modification <script>alert(1)</script>");
		});
		element(by.css('span[class="bootstrap-switch-label"]')).click();
		element(by.buttonText("Save")).click();
		browser.sleep(2000);
		deleteCollectionInstance();
	});
	
	it('bulk change collection instances', function() {
		
		entities.click();
		element(by.partialLinkText('Collection Instances')).click();
		var selectButton = element.all(by.model('collectionInstance.selected'));
		var categories = element.all(by.repeater(collInsRepeater)
		.column('collectionInstance.collectionCategory.name'));
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
		selectButton.get(1).click();
		element(by.buttonText("Bulk change with selected")).click();
		element(by.buttonText("System Type")).click();
		element(by.buttonText("Save")).click();
		browser.sleep(2000);
		element.all(by.repeater(collInsRepeater)
				.column('collectionInstance.name')).each(function(elem, index) {
					elem.getText().then(function(elemText) {
						if(elemText === "Low" || elemText === "Medium") {
							expect(categories.get(index).getText()).toBe("System Type");
							selectButton.get(index).click();
						}
					})
				});
		element(by.buttonText("Bulk change with selected")).click();
		element(by.buttonText("Criticality")).click();
		element(by.buttonText("Save")).click();
	});

});