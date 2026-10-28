import ExpoModulesCore

public class ExpoSiriIslandModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoSiriIslandModule")

        Constant("hardwareIslandSize") { () -> [String: Double] in
            let size = SiriIslandMetrics.hardwareSize
            return ["width": Double(size.width), "height": Double(size.height)]
        }

        Class(SiriIslandController.self) {
            Constructor { () -> SiriIslandController in
                SiriIslandController()
            }
            Property("__siri_island_controller__") { (_: SiriIslandController) -> Bool in
                true
            }
            Function("update") { (controller: SiriIslandController, values: [Double]) in
                controller.update(values)
            }
        }

        View(ExpoSiriIslandView.self) {
            Events("onIslandPress")

            Prop("controller") { (view: ExpoSiriIslandView, controller: SiriIslandController?) in
                view.controller = controller
            }
            Prop("phase") { (view: ExpoSiriIslandView, phase: String?) in
                view.configuration.phase = SiriIslandPhase(phase)
            }
            Prop("label") { (view: ExpoSiriIslandView, label: String?) in
                view.configuration.label = label ?? ""
            }
            Prop("shimmer") { (view: ExpoSiriIslandView, shimmer: Bool?) in
                view.configuration.shimmer = shimmer ?? false
            }
            Prop("hidesStatusBar") { (view: ExpoSiriIslandView, hidesStatusBar: Bool?) in
                view.configuration.hidesStatusBar = hidesStatusBar ?? false
            }
            Prop("hasContent") { (view: ExpoSiriIslandView, hasContent: Bool?) in
                view.configuration.hasContent = hasContent ?? false
            }
            Prop("glassEffect") { (view: ExpoSiriIslandView, glassEffect: Bool?) in
                view.configuration.glassEffect = glassEffect ?? true
            }
            Prop("gradientEffect") { (view: ExpoSiriIslandView, gradientEffect: Bool?) in
                view.configuration.gradientEffect = gradientEffect ?? true
            }
            Prop("gradientStart") { (view: ExpoSiriIslandView, gradientStart: Double?) in
                view.configuration.gradientStart = gradientStart ?? 0.5
            }
            Prop("gradientEnd") { (view: ExpoSiriIslandView, gradientEnd: Double?) in
                view.configuration.gradientEnd = gradientEnd ?? 1
            }
            Prop("gradientOpacity") { (view: ExpoSiriIslandView, gradientOpacity: Double?) in
                view.configuration.gradientOpacity = gradientOpacity ?? 0
            }
            Prop("gradientColor") { (view: ExpoSiriIslandView, gradientColor: UIColor?) in
                view.configuration.gradientColor = gradientColor ?? .black
            }

            OnViewDidUpdateProps { (view: ExpoSiriIslandView) in
                view.propsDidUpdate()
            }
        }

        View(ExpoSiriIslandContentView.self) {}
    }
}
