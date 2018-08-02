//
//  ViewController.swift
//  SwiftButton
//
//  Created by Keegs on 10/18/16.
//  Copyright © 2016 Keegan Farley. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var countLabel: UILabel!

    var cookieCount: Int = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func cookieClick(_ sender: AnyObject) {
        cookieCount += 1

        countLabel.text = "Count: \(cookieCount)"

        print(sender)
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        for touch in touches {
            let location = touch.location(in: self.view)

            inflateParticle(at: location)
        }
    }

    private func inflateParticle(at location: CGPoint) {
        print("inflating particle at \(location)")

        let particleText = NSAttributedString(string: "O")
        let height = particleText.heightWithConstrainedWidth(width: CGFloat.greatestFiniteMagnitude)
        let width = particleText.widthWithConstrainedHeight(height: CGFloat.greatestFiniteMagnitude)

        let particle = UILabel()
        particle.attributedText = particleText
        particle.frame = CGRect(x: location.x - (particle.layoutMargins.left / 2) - (width / 2),
                                y: location.y - (particle.layoutMargins.top / 1) - (height / 2),
                                width: particle.layoutMargins.left + width + particle.layoutMargins.right,
                                height: particle.layoutMargins.top + height + particle.layoutMargins.bottom)

        self.view.addSubview(particle)
    }

}

