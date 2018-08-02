//
//  ExtensionString.swift
//  SwiftButton
//
//  Created by Keegs on 10/18/16.
//  Copyright © 2016 Keegan Farley. All rights reserved.
//

import Foundation
import UIKit

extension NSAttributedString {
    func heightWithConstrainedWidth(width: CGFloat) -> CGFloat {
        let constraintRect = CGSize(width: width, height: .greatestFiniteMagnitude)
        let boundingBox = self.boundingRect(with: constraintRect, options: .usesLineFragmentOrigin, context: nil)

        return boundingBox.height
    }

    func widthWithConstrainedHeight(height: CGFloat) -> CGFloat {
        let constraintRect = CGSize(width: .greatestFiniteMagnitude, height: height)
        let boundingBox = self.boundingRect(with: constraintRect, options: .usesLineFragmentOrigin, context: nil)

        return boundingBox.width
    }
}
