/**
 * Expo config plugin for CarPlay (VisorUp).
 *
 * Managed Expo regenerates ios/ at build time, so all CarPlay native wiring must
 * live here. This plugin injects, at prebuild:
 *   1. The `com.apple.developer.carplay-maps` entitlement.
 *   2. The `UIApplicationSceneManifest` (phone + CarPlay head-unit/dashboard/cluster
 *      scenes) that @iternio/react-native-auto-play expects.
 *   3. The `getRootViewForAutoplay` bridge method in AppDelegate.swift so the
 *      MapTemplate can render React Native content on the car screen.
 *
 * IMPORTANT: This is UNVALIDATED scaffolding. CarPlay must be verified with an
 * EAS build + TestFlight on a real CarPlay head unit (or the Xcode CarPlay
 * Simulator on a Mac). See mobile/CARPLAY.md.
 */
const {
  withEntitlementsPlist,
  withInfoPlist,
  withAppDelegate,
} = require('@expo/config-plugins');

const SCENE_MANIFEST = {
  UIApplicationSupportsMultipleScenes: true,
  CPSupportsDashboardNavigationScene: true,
  CPSupportsInstrumentClusterNavigationScene: true,
  UISceneConfigurations: {
    UIWindowSceneSessionRoleApplication: [
      {
        UISceneClassName: 'UIWindowScene',
        UISceneConfigurationName: 'WindowApplication',
        UISceneDelegateClassName: 'WindowApplicationSceneDelegate',
      },
    ],
    CPTemplateApplicationSceneSessionRoleApplication: [
      {
        UISceneClassName: 'CPTemplateApplicationScene',
        UISceneConfigurationName: 'CarPlayHeadUnit',
        UISceneDelegateClassName: 'HeadUnitSceneDelegate',
      },
    ],
    CPTemplateApplicationDashboardSceneSessionRoleApplication: [
      {
        UISceneClassName: 'CPTemplateApplicationDashboardScene',
        UISceneConfigurationName: 'CarPlayDashboard',
        UISceneDelegateClassName: 'DashboardSceneDelegate',
      },
    ],
    CPTemplateApplicationInstrumentClusterSceneSessionRoleApplication: [
      {
        UISceneClassName: 'CPTemplateApplicationInstrumentClusterScene',
        UISceneConfigurationName: 'CarPlayCluster',
        UISceneDelegateClassName: 'ClusterSceneDelegate',
      },
    ],
  },
};

const AUTOPLAY_METHOD = `
  @objc func getRootViewForAutoplay(
    moduleName: String,
    initialProperties: [String: Any]?
  ) -> UIView? {
    if RCTIsNewArchEnabled() {
      if let factory = reactNativeFactory?.rootViewFactory as? ExpoReactRootViewFactory {
        return factory.superView(
          withModuleName: moduleName,
          initialProperties: initialProperties,
          launchOptions: nil,
          bundleConfiguration: RCTBundleConfiguration.default(),
          devMenuConfiguration: nil
        )
      }
      return reactNativeFactory?.rootViewFactory.view(
        withModuleName: moduleName,
        initialProperties: initialProperties,
        launchOptions: nil,
        bundleConfiguration: RCTBundleConfiguration.default(),
        devMenuConfiguration: RCTDevMenuConfiguration.default()
      )
    }
    return nil
  }
`;

function withCarPlayEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    cfg.modResults['com.apple.developer.carplay-maps'] = true;
    return cfg;
  });
}

function withCarPlaySceneManifest(config) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = SCENE_MANIFEST;
    return cfg;
  });
}

function withAutoplayAppDelegate(config) {
  return withAppDelegate(config, (cfg) => {
    let contents = cfg.modResults.contents;
    if (contents.includes('getRootViewForAutoplay')) return cfg;

    // Insert the method INSIDE the AppDelegate class (where `reactNativeFactory`
    // is a stored property), right after didFinishLaunchingWithOptions. The final
    // brace of the file belongs to ReactNativeDelegate, where reactNativeFactory
    // is out of scope, so we must not anchor on it.
    const anchor =
      'return super.application(application, didFinishLaunchingWithOptions: launchOptions)\n  }';
    if (contents.includes(anchor)) {
      contents = contents.replace(anchor, anchor + '\n' + AUTOPLAY_METHOD);
      cfg.modResults.contents = contents;
    }
    return cfg;
  });
}

module.exports = function withCarPlay(config) {
  config = withCarPlayEntitlement(config);
  config = withCarPlaySceneManifest(config);
  config = withAutoplayAppDelegate(config);
  return config;
};
