import ExpoModulesCore
import UIKit

public final class ExpoSiriIslandView: ExpoView {
    let onIslandPress = EventDispatcher()
    let overlay = SiriIslandOverlay()
    var configuration = SiriIslandConfiguration()

    var controller: SiriIslandController? {
        get { overlay.controller }
        set { overlay.controller = newValue }
    }

    public required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        isUserInteractionEnabled = false
        overlay.onPress = { [weak self] in
            self?.onIslandPress()
        }
    }

    public override func didMoveToWindow() {
        super.didMoveToWindow()
        if let window {
            overlay.attach(to: window)
        } else {
            overlay.detach()
        }
    }

    public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
        if let content = childComponentView as? ExpoSiriIslandContentView {
            overlay.contentView = content
        } else {
            insertSubview(childComponentView, at: min(index, subviews.count))
        }
    }

    public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
        childComponentView.removeFromSuperview()
        if childComponentView === overlay.contentView {
            overlay.contentView = nil
        }
    }

    func propsDidUpdate() {
        overlay.configuration = configuration
    }
}
