var React = require("react");

var CombatState = React.createClass({
    render: function () {
        //var m = this.props.monster,
        //    avatarImageStyles = {},
        //    imageClassName = 'image';
        //if (m.avatar) {
        //    avatarImageStyles.backgroundImage = "url(" + m.avatar + ')';
        //} else {
        //    imageClassName += ' missing';
        //}
        return (
            <div className="combat-window">
                <div className={imageClassName} style={avatarImageStyles} />
                <div className="cover" />
            </div>
        );
    }
});


module.exports = CombatState;