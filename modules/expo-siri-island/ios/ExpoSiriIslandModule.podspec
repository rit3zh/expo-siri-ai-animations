Pod::Spec.new do |s|
  s.name           = 'ExpoSiriIslandModule'
  s.version        = '1.0.0'
  s.summary        = 'Siri Dynamic Island animation rendered with Metal.'
  s.description    = 'A native Siri Dynamic Island surface with a glass orb, wave, spinner and edge glow drawn with Metal shaders, hosting custom React content.'
  s.license        = 'MIT'
  s.author         = 'rit3zh CX'
  s.homepage       = 'https://github.com/rit3zh'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
  s.exclude_files = "Shaders/**/*.h"
  s.frameworks = 'Metal', 'MetalKit'

  s.resource_bundles = {
    'ExpoSiriIslandShaders' => ['Shaders/**/*.metal']
  }
end
