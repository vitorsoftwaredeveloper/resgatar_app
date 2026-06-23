Pod::Spec.new do |s|
  s.name           = 'DevModeDetector'
  s.version        = '0.1.0'
  s.summary        = 'Detecta se as Opções do desenvolvedor estão ativadas (Android).'
  s.description    = 'Módulo nativo local para bloquear builds de produção em modo desenvolvedor.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
