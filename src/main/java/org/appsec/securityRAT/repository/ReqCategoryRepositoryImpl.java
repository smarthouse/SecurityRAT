package org.appsec.securityRAT.repository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.appsec.securityRAT.domain.CollectionCategory;
import org.appsec.securityRAT.domain.CollectionInstance;
import org.appsec.securityRAT.domain.OptColumn;
import org.appsec.securityRAT.domain.ProjectType;
import org.appsec.securityRAT.domain.ReqCategory;
import org.appsec.securityRAT.domain.RequirementSkeleton;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;
import org.springframework.beans.factory.annotation.Autowired;

public class ReqCategoryRepositoryImpl implements ReqCategoryRepositoryCustom{

	@Autowired
	private OptColumnRepository optColumnRepository;

	@Autowired
	private CollectionCategoryRepository collectionCategoryRepository;

	@Autowired
	private CollectionInstanceRepository collectionInstanceRepository;

	@Autowired
	private ReqCategoryRepository reqCategoryRepository;

	@Autowired
	private RequirementSkeletonRepository requirementSkeletonRepository;

	@Autowired
	private TagInstanceRepository tagInstanceRepository;

	@Autowired
	private OptColumnContentRepository optColumnContentRepository;

	@PersistenceContext
	private EntityManager em;

    private static SessionFactory sessionFactory;
    private static ServiceRegistry serviceRegistry;

	@Override
	public List<ReqCategory> findEagerlyCategoriesWithRequirements(
			List<CollectionInstance> receivedCollectionInstances,
			List<ProjectType> projectTypes) {

		//first simply get a list of active requirement categories and create the list of objects
		List<ReqCategory> activeCategories = reqCategoryRepository.findAllActive();

		//get relevant columns for given projectTypes
		List<OptColumn> relevantOptColumns = new ArrayList<OptColumn>();
		for (ProjectType projectType : projectTypes) {
			Set<OptColumn>optColumnsForProjectType = optColumnRepository.getActiveRelevantOptcolumnsForProjectType(projectType.getId());
			for (OptColumn optColumnForProjectType : optColumnsForProjectType) {
				if (!relevantOptColumns.contains(optColumnForProjectType))
					relevantOptColumns.add(optColumnForProjectType);
			}
		}

		//get relevant collection categories for collection instances
		List<CollectionCategory> receivedCollectionCategories = new ArrayList<CollectionCategory>();
		for (CollectionInstance receivedCollectionInstance : receivedCollectionInstances) {
			CollectionCategory collectionCategory = receivedCollectionInstance.getCollectionCategory();
			if (!receivedCollectionCategories.contains(collectionCategory)) {
				receivedCollectionCategories.add(collectionCategory);
			}
		}


		for (ReqCategory activeCategory : activeCategories) {
			Set<RequirementSkeleton> skeletonsToAdd = new HashSet<RequirementSkeleton>();
			Set<RequirementSkeleton> skeletonsForCategory = requirementSkeletonRepository.findActiveReqsForCategoryAndProjectTypes(activeCategory, projectTypes);
			for (RequirementSkeleton skeleton: skeletonsForCategory) {
				Set<CollectionInstance> allCollectionsForSkeleton = collectionInstanceRepository.findActiveCollectionsForSkeleton(skeleton);
				boolean skeletonInAllCollectionCategories = true;
				for (CollectionCategory receivedCollectionCategory : receivedCollectionCategories) {
					boolean skeletonAtLeastInOneCollection = false;
					for (CollectionInstance collectionInstance : allCollectionsForSkeleton) {
						if (receivedCollectionCategory.getCollectionInstances().contains(collectionInstance)) {
							if (receivedCollectionInstances.contains(collectionInstance))
								skeletonAtLeastInOneCollection = true;
						}
					}
					if (!skeletonAtLeastInOneCollection) skeletonInAllCollectionCategories = false;
				}
				if (skeletonInAllCollectionCategories) {
					skeleton.setTagInstances(tagInstanceRepository.getTagInstancesForSkeleton(skeleton));
					skeleton.setOptColumnContents(optColumnContentRepository.findOptColumnsForSkeletonAndProjectTypes(skeleton, projectTypes));
					skeletonsToAdd.add(skeleton);
				}
			}
			activeCategory.setRequirementSkeletons(skeletonsToAdd);
		}


		/*



		List<OptColumn> relevantOptColumns = new ArrayList<OptColumn>();
		//get relevant columns for given projectTypes
		for (ProjectType projectType : projectTypes) {
			List<OptColumn>optColumnsForProjectType = optColumnRepository.getActiveRelevantOptcolumnsForProjectType(projectType.getId());
			for (OptColumn optColumnForProjectType : optColumnsForProjectType) {
				if (!relevantOptColumns.contains(optColumnForProjectType))
					relevantOptColumns.add(optColumnForProjectType);
			}
		}


		//get collection categories for collection instances
		List<CollectionCategory> collectionCategories = collectionCategoryRepository.findCollectionCategoriesForInstances(collectionInstances);

		String queryString = "select distinct reqCategory from ReqCategory reqCategory "
				+ "left join fetch reqCategory.requirementSkeletons skeleton ";
		if (!relevantOptColumns.isEmpty())
			queryString += "left join fetch skeleton.optColumnContents optColumnContent ";
		queryString += "left join fetch skeleton.tagInstances tagInstance "
				+ "left join fetch skeleton.collectionInstances collectionInstance "
				+ "left join fetch skeleton.projectTypes projectType ";
		if (!relevantOptColumns.isEmpty())
			queryString += "left join fetch optColumnContent.optColumn optColumn ";

		queryString	+= "where projectType in :projectTypes "
				+ "and reqCategory.active=true "
				+ "and skeleton.active=true "
				+ "and tagInstance.active=true "
				+ "and collectionInstance in :collectionInstances "
				+ "and collectionInstance.active=true ";

		if (!relevantOptColumns.isEmpty()) {
			queryString += "and optColumn in :relevantOptColumns ";
				//	+ "and optColumn.active=true ";
		}
		queryString += "group by skeleton";

		TypedQuery<ReqCategory> query = em.createQuery(queryString, ReqCategory.class);

		if (!relevantOptColumns.isEmpty() || relevantOptColumns != null)
			query.setParameter("relevantOptColumns", relevantOptColumns);
		query.setParameter("collectionInstances", collectionInstances);
		query.setParameter("projectTypes", projectTypes);
		List<ReqCategory> eagerReqCategories = query.getResultList();
/*
		for (ReqCategory reqCategory : eagerReqCategories) {
			for (RequirementSkeleton reqSkeleton : reqCategory.getRequirementSkeletons()) {


			}

		}*/

		return activeCategories;
	}



	private static SessionFactory createSessionFactory() {
	    Configuration configuration = new Configuration();
	    configuration.configure();
	    serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
	            configuration.getProperties()).build();
	    sessionFactory = configuration.buildSessionFactory(serviceRegistry);
	    return sessionFactory;
	}

}
